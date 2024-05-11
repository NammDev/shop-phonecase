'use server'
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
