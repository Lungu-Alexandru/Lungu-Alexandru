import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import Stripe from 'stripe';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import QRCode from 'qrcode';

admin.initializeApp();
const db = admin.firestore();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

export const createCheckoutSession = functions.https.onCall(async (data, context) => {
  const { eventId, quantity, category } = data as { eventId: string; quantity: number; category: string };
  const eventRef = db.collection('events').doc(eventId);
  const eventSnap = await eventRef.get();
  if (!eventSnap.exists) throw new functions.https.HttpsError('not-found', 'Event not found');
  const event = eventSnap.data()!;

  const price = Number(event.prices?.[category] ?? 0);
  if (!price) throw new functions.https.HttpsError('failed-precondition', 'Invalid category');

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(price * 100),
          product_data: {
            name: event.title,
            description: `${category} x${quantity}`,
          },
        },
        quantity,
      },
    ],
    success_url: `${process.env.WEB_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.WEB_URL}/cancel`,
    metadata: { eventId, category },
  });

  return { id: session.id };
});

export const handleStripeWebhook = functions.https.onRequest(async (req, res): Promise<void> => {
  const sig = req.headers['stripe-signature'] as string;
  const rawBody = (req as any).rawBody as Buffer;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    await fulfillOrder(session);
  }

  res.json({ received: true });
});

async function fulfillOrder(session: Stripe.Checkout.Session) {
  const eventId = session.metadata?.eventId as string;
  const buyerEmail = session.customer_details?.email as string;
  const ticketsCount = session.amount_total ? Math.max(1, Math.round((session.amount_total / (session.amount_subtotal || session.amount_total)))) : 1;

  const ticketId = db.collection('events').doc(eventId).collection('tickets').doc().id;
  const qrData = `gettiks:${eventId}:${ticketId}`;
  const qrPng = await QRCode.toDataURL(qrData);
  const pdfBuffer = await generateTicketPdf({ qrPng, ticketId, eventId });

  await db.collection('events').doc(eventId).collection('tickets').doc(ticketId).set({
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    ownerEmail: buyerEmail,
    sessionId: session.id,
    qrData,
    status: 'active',
  });

  await sendEmailWithAttachment(buyerEmail, 'Biletul tău Gettiks', 'Mulțumim pentru achiziție!', pdfBuffer, `bilet-${ticketId}.pdf`);
}

async function generateTicketPdf({ qrPng, ticketId, eventId }: { qrPng: string; ticketId: string; eventId: string }) {
  return new Promise<Buffer>((resolve) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const buffers: Uint8Array[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.fontSize(20).text('Gettiks - Bilet', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Event: ${eventId}`);
    doc.text(`Ticket: ${ticketId}`);
    doc.image(qrPng, { fit: [200, 200], align: 'center' });
    doc.end();
  });
}

async function sendEmailWithAttachment(to: string, subject: string, text: string, attachment: Buffer, filename: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  await transporter.sendMail({
    from: 'Gettiks <no-reply@gettiks.com>',
    to,
    subject,
    text,
    attachments: [{ filename, content: attachment }],
  });
}