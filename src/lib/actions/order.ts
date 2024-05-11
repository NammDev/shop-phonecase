'use server'
import Stripe from 'stripe'
import { db } from '../db'

export const getOrder = async (userId: string, configId: string) => {
  return await db.order.findFirst({
    where: {
      userId: userId,
      configurationId: configId,
    },
  })
}

export const createOrder = async (userId: string, configId: string, price: number) => {
  return await db.order.create({
    data: {
      userId: userId,
      configurationId: configId,
      amount: price / 100,
    },
  })
}

export const updateOrderStripe = async (orderId: string, session: Stripe.Checkout.Session) => {
  const billingAddress = session.customer_details!.address
  const shippingAddress = session.shipping_details!.address
  return await db.order.update({
    where: {
      id: orderId,
    },
    data: {
      isPaid: true,
      shippingAddress: {
        create: {
          name: session.customer_details!.name!,
          city: shippingAddress!.city!,
          country: shippingAddress!.country!,
          postalCode: shippingAddress!.postal_code!,
          street: shippingAddress!.line1!,
          state: shippingAddress!.state,
        },
      },
      billingAddress: {
        create: {
          name: session.customer_details!.name!,
          city: billingAddress!.city!,
          country: billingAddress!.country!,
          postalCode: billingAddress!.postal_code!,
          street: billingAddress!.line1!,
          state: billingAddress!.state,
        },
      },
    },
  })
}
