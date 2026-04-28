import { NextResponse } from 'next/server';

/**
 * WhatsApp Webhook Endpoint
 * 
 * In development, this simulates the WhatsApp Business API webhook.
 * In production, replace with actual Meta webhook verification and message parsing.
 * 
 * Expected message format:
 *   "Order: [product], Address: [address], Phone: [phone]"
 */

// GET — Webhook verification (Meta sends a GET request to verify)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'swiftchain_webhook_verify_2024';

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

// POST — Incoming message handler
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Parse WhatsApp message (simplified format)
    const message = body.message || body.text || '';
    const senderPhone = body.from || body.phone || '';

    if (!message) {
      return NextResponse.json({ error: 'No message body' }, { status: 400 });
    }

    // Parse order from message
    // Format: "Order: [product], Address: [address], Name: [name]"
    const orderMatch = message.match(/Order:\s*(.+?),\s*Address:\s*(.+?)(?:,\s*Name:\s*(.+))?$/i);

    if (!orderMatch) {
      return NextResponse.json({
        reply: '❌ Invalid format. Please send: Order: [product], Address: [address], Name: [your name]',
        parsed: false,
      });
    }

    const parsedOrder = {
      product: orderMatch[1].trim(),
      address: orderMatch[2].trim(),
      customerName: orderMatch[3]?.trim() || 'WhatsApp Customer',
      customerPhone: senderPhone,
      source: 'WHATSAPP',
      priority: 'NORMAL',
      // Default coordinates (would use geocoding in production)
      latitude: -25.7479 + (Math.random() - 0.5) * 0.1,
      longitude: 28.2293 + (Math.random() - 0.5) * 0.1,
    };

    // In production, create order via internal API call
    // For now, return parsed data
    return NextResponse.json({
      reply: `✅ Order received!\n📦 Product: ${parsedOrder.product}\n📍 Address: ${parsedOrder.address}\n👤 Name: ${parsedOrder.customerName}\n\nYour order is being processed. You'll receive tracking updates shortly.`,
      parsed: true,
      order: parsedOrder,
    });
  } catch (error) {
    console.error('[API] WhatsApp webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
