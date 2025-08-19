import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  // In production this should proxy to Firebase Function to create a Stripe session
  // Temporary mocked response for local dev
  return res.status(200).json({ id: 'cs_test_mocked' });
}

