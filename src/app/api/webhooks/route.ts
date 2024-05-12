import { updateOrderStripe } from '@/lib/actions/order'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Resend } from 'resend'
import OrderReceivedEmail from '@/components/emails/OrderReceivedEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    // make sure request from stripe
    const signature = headers().get('stripe-signature')
    if (!signature) return new Response('Invalid signaturee', { status: 400 })

    // get event from stripe
    const body = await req.text()
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    // user successful paid
    if (event.type === 'checkout.session.completed') {
      if (!event.data.object.customer_details?.email) throw new Error('Missing user email')

      // Get metadata from client send to stripe
      const session = event.data.object as Stripe.Checkout.Session
      const { userId, orderId } = session.metadata || {
        userId: null,
        orderId: null,
      }
      if (!userId || !orderId) throw new Error('Invalid request metadata')

      // update order
      const updatedOrder = await updateOrderStripe(orderId, session)

      await resend.emails.send({
        from: 'namdeveloper.ca@gmail.com',
        to: [event.data.object.customer_details.email],
        subject: 'Thanks for your order!',
        react: OrderReceivedEmail({
          orderId,
          orderDate: updatedOrder.createdAt.toLocaleDateString(),
          // @ts-ignore
          shippingAddress: {
            name: session.customer_details!.name!,
            city: session.shipping_details!.address!.city!,
            country: session.shipping_details!.address!.country!,
            postalCode: session.shipping_details!.address!.postal_code!,
            street: session.shipping_details!.address!.line1!,
            state: session.shipping_details!.address!.state,
          },
        }),
      })
      return NextResponse.json({ result: event, ok: true })
    }
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: 'Something went wrong', ok: false }, { status: 500 })
  }
}
