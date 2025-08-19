import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import Stripe from 'stripe'
import QRCode from 'qrcode'
import PDFDocument from 'pdfkit'
import nodemailer from 'nodemailer'

admin.initializeApp()
const firestore = admin.firestore()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2024-06-20' })

export const createCheckoutSession = functions.https.onCall(async (data, context) => {
  const { eventId, tickets } = data as { eventId: string; tickets: { price: number; quantity: number; category: string }[] }
  const userId = context.auth?.uid
  if (!userId) throw new functions.https.HttpsError('unauthenticated', 'Necesită autentificare')

  const lineItems = tickets.map(t => ({ price_data: { currency: 'ron', product_data: { name: `Bilet ${t.category}` }, unit_amount: Math.round(t.price * 100) }, quantity: t.quantity }))
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card', 'link'],
    line_items: lineItems,
    success_url: `${process.env.PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.PUBLIC_URL}/events/${eventId}`,
    metadata: { eventId, userId }
  })
  return { id: session.id, url: session.url }
})

export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'] as string
  let event
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET as string)
  } catch (err: any) {
    console.error('Webhook Error', err.message)
    res.status(400).send(`Webhook Error: ${err.message}`)
    return
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const eventId = (session.metadata?.eventId as string) || 'unknown'
    const userId = (session.metadata?.userId as string) || 'unknown'
    await issueTickets({ eventId, userId, sessionId: session.id })
  }
  res.json({ received: true })
})

async function issueTickets({ eventId, userId, sessionId }: { eventId: string; userId: string; sessionId: string }) {
  const ticketRef = firestore.collection('users').doc(userId).collection('tickets').doc()
  const qrPayload = JSON.stringify({ ticketId: ticketRef.id, eventId, userId })
  const qrDataUrl = await QRCode.toDataURL(qrPayload)

  const pdfBuffer = await generateTicketPdf({ qrDataUrl, eventId, ticketId: ticketRef.id })
  await ticketRef.set({ eventId, createdAt: admin.firestore.FieldValue.serverTimestamp(), qrDataUrl, sessionId })
  await sendTicketEmail({ to: 'user@example.com', pdfBuffer })
}

async function generateTicketPdf({ qrDataUrl, eventId, ticketId }: { qrDataUrl: string; eventId: string; ticketId: string }): Promise<Buffer> {
  const doc = new PDFDocument({ size: 'A4', margin: 50 })
  const chunks: Buffer[] = []
  return await new Promise((resolve) => {
    doc.on('data', (chunk) => chunks.push(chunk as Buffer))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.fontSize(20).text('Bilet Gettiks', { align: 'center' })
    doc.moveDown()
    doc.fontSize(12).text(`Eveniment: ${eventId}`)
    doc.text(`Ticket ID: ${ticketId}`)
    doc.moveDown()
    doc.image(qrDataUrl, { fit: [200, 200], align: 'center' })
    doc.end()
  })
}

async function sendTicketEmail({ to, pdfBuffer }: { to: string; pdfBuffer: Buffer }) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  })
  await transporter.sendMail({
    from: 'Gettiks <no-reply@gettiks.com>',
    to,
    subject: 'Biletul tău Gettiks',
    text: 'Atașat găsești biletul tău.',
    attachments: [{ filename: 'bilet.pdf', content: pdfBuffer }]
  })
}

