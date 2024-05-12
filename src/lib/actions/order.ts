'use server'

import Stripe from 'stripe'
import { db } from '../db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { OrderStatus } from '@prisma/client'

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

export const getPaymentStatus = async ({ orderId }: { orderId: string }) => {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user?.id || !user.email) {
    throw new Error('You need to be logged in to view this page.')
  }

  const order = await db.order.findFirst({
    where: { id: orderId, userId: user.id },
    include: {
      billingAddress: true,
      configuration: true,
      shippingAddress: true,
      user: true,
    },
  })

  if (!order) throw new Error('This order does not exist.')

  if (order.isPaid) {
    return order
  } else {
    return false
  }
}

export const changeOrderStatus = async ({
  id,
  newStatus,
}: {
  id: string
  newStatus: OrderStatus
}) => {
  await db.order.update({
    where: { id },
    data: { status: newStatus },
  })
}

export const getOrders = async () => {
  return await db.order.findMany({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: true,
      shippingAddress: true,
    },
  })
}

export const getOrdersAggregate = async () => {
  const lastWeekSum = await db.order.aggregate({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
    },
    _sum: {
      amount: true,
    },
  })

  const lastMonthSum = await db.order.aggregate({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    },
    _sum: {
      amount: true,
    },
  })
  return { lastWeekSum, lastMonthSum }
}
