import { Router } from 'express';
import * as admin from 'firebase-admin';
import * as QRCode from 'qrcode';
import { authenticateUser } from '../middleware/auth';

const router = Router();
const db = admin.firestore();

// Generate QR code for ticket
router.get('/:ticketId/qr', authenticateUser, async (req, res) => {
  try {
    const { ticketId } = req.params;
    const userId = req.user!.uid;

    // Get ticket
    const ticketDoc = await db.collection('tickets').doc(ticketId).get();
    if (!ticketDoc.exists || ticketDoc.data()!.userId !== userId) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const ticket = ticketDoc.data()!;
    
    if (ticket.status !== 'active') {
      return res.status(400).json({ error: 'Ticket is not active' });
    }

    // Generate QR code
    const qrCodeData = JSON.stringify({
      ticketId,
      eventId: ticket.eventId,
      userId,
      timestamp: Date.now(),
    });

    const qrCodeUrl = await QRCode.toDataURL(qrCodeData, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 256
    });

    res.json({ qrCode: qrCodeUrl });

  } catch (error) {
    console.error('QR code generation error:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// Validate ticket at event entrance
router.post('/validate', authenticateUser, async (req, res) => {
  try {
    const { qrData } = req.body;
    
    if (!qrData) {
      return res.status(400).json({ error: 'QR data is required' });
    }

    let ticketData;
    try {
      ticketData = JSON.parse(qrData);
    } catch {
      return res.status(400).json({ error: 'Invalid QR code format' });
    }

    const { ticketId, eventId, userId } = ticketData;

    // Get ticket
    const ticketDoc = await db.collection('tickets').doc(ticketId).get();
    if (!ticketDoc.exists) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const ticket = ticketDoc.data()!;

    // Validate ticket data
    if (ticket.eventId !== eventId || ticket.userId !== userId) {
      return res.status(400).json({ error: 'Invalid ticket data' });
    }

    if (ticket.status === 'used') {
      return res.status(400).json({ 
        error: 'Ticket already used',
        usedAt: ticket.usedAt
      });
    }

    if (ticket.status !== 'active') {
      return res.status(400).json({ error: 'Ticket is not active' });
    }

    // Mark ticket as used
    await db.collection('tickets').doc(ticketId).update({
      status: 'used',
      usedAt: admin.firestore.FieldValue.serverTimestamp(),
      validatedBy: req.user!.uid,
    });

    res.json({ 
      success: true, 
      ticket: {
        id: ticketId,
        eventTitle: ticket.eventTitle,
        ticketType: ticket.ticketTypeName,
        holderName: ticket.holderName || 'N/A',
      }
    });

  } catch (error) {
    console.error('Ticket validation error:', error);
    res.status(500).json({ error: 'Failed to validate ticket' });
  }
});

export { router as ticketRoutes };