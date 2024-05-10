'use server'

import { CaseColor, CaseFinish, CaseMaterial, PhoneModel } from '@prisma/client'
import { db } from '../db'

export const getConfiguration = async (configId: string) => {
  return await db.configuration.findUnique({
    where: { id: configId },
  })
}

export type SaveConfigType = {
  color: CaseColor
  finish: CaseFinish
  material: CaseMaterial
  model: PhoneModel
  configId: string
}

export const saveConfigurationDb = async ({
  color,
  finish,
  material,
  model,
  configId,
}: SaveConfigType) => {
  try {
    await db.configuration.update({
      where: { id: configId },
      data: { color, finish, material, model },
    })
  } catch (error) {
    console.log(error)
  }
}
