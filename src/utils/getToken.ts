import { Request } from 'express'

export const getToken = (req: Request) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  return token
}