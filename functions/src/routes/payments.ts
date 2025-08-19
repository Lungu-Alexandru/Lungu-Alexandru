import { Router } from 'express';
import Stripe from 'stripe';
import * as admin from 'firebase-admin';
import { authenticateUser } from '../middleware/auth';
import { validatePaymentIntent, validateRefund } from '../validators/payment';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const db = admin.firestore();

// Create payment intent
router.post('/create-intent', authenticateUser, async (req, res) => {
  try {
    const { error, value } = validatePaymentIntent(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { eventId, ticketTypeId, quantity, totalAmount } = value;
    const userId = req.user!.uid;

    // Verify event and ticket availability
    const eventDoc = await db.collection('events').doc(eventId).get();
    if (!eventDoc.exists) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const event = eventDoc.data()!;
    const ticketType = event.ticketTypes.find((t: any) => t.id === ticketTypeId);
    
    if (!ticketType) {
      return res.status(404).json({ error: 'Ticket type not found' });
    }

    // Check availability
    const availableTickets = ticketType.quantity - ticketType.sold;
    if (availableTickets < quantity) {
      return res.status(400).json({ 
        error: 'Not enough tickets available',
        available: availableTickets
      });
    }

    // Calculate total with commission and VAT
    const subtotal = ticketType.price * quantity;
    const commission = Math.round(subtotal * 0.04 * 100) / 100;
    const vat = Math.round((subtotal + commission) * 0.21 * 100) / 100;
    const calculatedTotal = Math.round((subtotal + commission + vat) * 100) / 100;

    // Verify the total amount
    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      return res.status(400).json({ 
        error: 'Invalid total amount',
        calculated: calculatedTotal,
        provided: totalAmount
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: 'ron',
      metadata: {
        eventId,
        ticketTypeId,
        quantity: quantity.toString(),
        userId,
        subtotal: subtotal.toString(),
        commission: commission.toString(),
        vat: vat.toString(),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Create pending order
    const orderData = {
      id: paymentIntent.id,
      userId,
      eventId,
      eventTitle: event.title,
      ticketTypeId,
      ticketTypeName: ticketType.name,
      quantity,
      subtotal,
      commission,
      vat,
      totalAmount,
      status: 'pending',
      paymentIntentId: paymentIntent.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('orders').doc(paymentIntent.id).set(orderData);

    res.json({
      clientSecret: paymentIntent.client_secret,
      orderId: paymentIntent.id,
    });

  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Confirm payment and create tickets
router.post('/confirm/:paymentIntentId', authenticateUser, async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    const userId = req.user!.uid;

    // Get payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    // Get order
    const orderDoc = await db.collection('orders').doc(paymentIntentId).get();
    if (!orderDoc.exists || orderDoc.data()!.userId !== userId) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderDoc.data()!;
    
    if (order.status === 'completed') {
      return res.status(400).json({ error: 'Order already completed' });
    }

    // Use transaction to ensure consistency
    await db.runTransaction(async (transaction) => {
      // Get event document
      const eventRef = db.collection('events').doc(order.eventId);
      const eventDoc = await transaction.get(eventRef);
      
      if (!eventDoc.exists) {
        throw new Error('Event not found');
      }

      const event = eventDoc.data()!;
      const ticketTypes = [...event.ticketTypes];
      const ticketTypeIndex = ticketTypes.findIndex(t => t.id === order.ticketTypeId);
      
      if (ticketTypeIndex === -1) {
        throw new Error('Ticket type not found');
      }

      // Check availability again
      const ticketType = ticketTypes[ticketTypeIndex];
      const availableTickets = ticketType.quantity - ticketType.sold;
      
      if (availableTickets < order.quantity) {
        throw new Error('Tickets no longer available');
      }

      // Update ticket type sold count
      ticketTypes[ticketTypeIndex].sold += order.quantity;
      
      // Update event
      transaction.update(eventRef, {
        ticketTypes,
        soldTickets: admin.firestore.FieldValue.increment(order.quantity),
        revenue: admin.firestore.FieldValue.increment(order.subtotal),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Create tickets
      const tickets = [];
      for (let i = 0; i < order.quantity; i++) {
        const ticketId = db.collection('tickets').doc().id;
        const qrData = `${order.eventId}-${ticketId}-${userId}`;
        
        const ticketData = {
          id: ticketId,
          eventId: order.eventId,
          eventTitle: order.eventTitle,
          userId,
          orderId: paymentIntentId,
          ticketTypeId: order.ticketTypeId,
          ticketTypeName: order.ticketTypeName,
          price: ticketType.price,
          qrCode: qrData,
          status: 'active',
          purchaseDate: admin.firestore.FieldValue.serverTimestamp(),
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        tickets.push(ticketData);
        transaction.set(db.collection('tickets').doc(ticketId), ticketData);
      }

      // Update order status
      transaction.update(db.collection('orders').doc(paymentIntentId), {
        status: 'completed',
        tickets: tickets.map(t => t.id),
        completedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    res.json({ success: true, orderId: paymentIntentId });

  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

// Refund ticket
router.post('/refund', authenticateUser, async (req, res) => {
  try {
    const { error, value } = validateRefund(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { ticketId, reason } = value;
    const userId = req.user!.uid;

    // Get ticket
    const ticketDoc = await db.collection('tickets').doc(ticketId).get();
    if (!ticketDoc.exists || ticketDoc.data()!.userId !== userId) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const ticket = ticketDoc.data()!;
    
    if (ticket.status !== 'active') {
      return res.status(400).json({ error: 'Ticket cannot be refunded' });
    }

    // Get order
    const orderDoc = await db.collection('orders').doc(ticket.orderId).get();
    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderDoc.data()!;

    // Check if refund is allowed (24h before event)
    const eventDoc = await db.collection('events').doc(ticket.eventId).get();
    const event = eventDoc.data()!;
    const eventDate = event.startDate.toDate();
    const now = new Date();
    const hoursUntilEvent = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilEvent < 24) {
      return res.status(400).json({ error: 'Refunds not allowed within 24 hours of event' });
    }

    // Calculate refund amount (95% of ticket price)
    const refundAmount = Math.round(ticket.price * 0.95 * 100);

    // Create refund in Stripe
    const refund = await stripe.refunds.create({
      payment_intent: order.paymentIntentId,
      amount: refundAmount,
      metadata: {
        ticketId,
        reason,
      },
    });

    // Update ticket status
    await db.collection('tickets').doc(ticketId).update({
      status: 'refunded',
      refundId: refund.id,
      refundAmount: refundAmount / 100,
      refundReason: reason,
      refundedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ 
      success: true, 
      refundId: refund.id,
      refundAmount: refundAmount / 100
    });

  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ error: 'Failed to process refund' });
  }
});

export { router as paymentRoutes };