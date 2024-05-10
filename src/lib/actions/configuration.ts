import { db } from '../db'

export const getConfiguration = async (configId: string) => {
  return db.configuration.findUnique({
    where: { id: configId },
  })
}
