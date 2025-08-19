"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleStripeWebhook = exports.createCheckoutSession = void 0;
const admin = __importStar(require("firebase-admin"));
const functions = __importStar(require("firebase-functions"));
const stripe_1 = __importDefault(require("stripe"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const qrcode_1 = __importDefault(require("qrcode"));
admin.initializeApp();
const db = admin.firestore();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
});
exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
    const { eventId, quantity, category } = data;
    const eventRef = db.collection('events').doc(eventId);
    const eventSnap = await eventRef.get();
    if (!eventSnap.exists)
        throw new functions.https.HttpsError('not-found', 'Event not found');
    const event = eventSnap.data();
    const price = Number(event.prices?.[category] ?? 0);
    if (!price)
        throw new functions.https.HttpsError('failed-precondition', 'Invalid category');
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
exports.handleStripeWebhook = functions.https.onRequest(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const rawBody = req.rawBody;
    let event;
    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        console.error('Webhook signature verification failed.', err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        await fulfillOrder(session);
    }
    res.json({ received: true });
});
async function fulfillOrder(session) {
    const eventId = session.metadata?.eventId;
    const buyerEmail = session.customer_details?.email;
    const ticketsCount = session.amount_total ? Math.max(1, Math.round((session.amount_total / (session.amount_subtotal || session.amount_total)))) : 1;
    const ticketId = db.collection('events').doc(eventId).collection('tickets').doc().id;
    const qrData = `gettiks:${eventId}:${ticketId}`;
    const qrPng = await qrcode_1.default.toDataURL(qrData);
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
async function generateTicketPdf({ qrPng, ticketId, eventId }) {
    return new Promise((resolve) => {
        const doc = new pdfkit_1.default({ size: 'A4', margin: 50 });
        const buffers = [];
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
async function sendEmailWithAttachment(to, subject, text, attachment, filename) {
    const transporter = nodemailer_1.default.createTransport({
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
