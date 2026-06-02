import { Controller } from '../types/express.ts'

import { getToken } from '../utils/getToken.ts'
import { checkTokenModel, updateTokenStatusModel } from '../model/token.ts'

export const checkToken: Controller<void> = async (req, res, next) => {
  try {
    const token = getToken(req)
    if (!token) {
      res.status(401).json({
        message: 'token不能为空',
      })
      return
    }
    const tokenInfo = await checkTokenModel(token)
    if (!tokenInfo) {
      await updateTokenStatusModel(token)
      res.status(401).json({
        message: 'token无效或已过期',
      })
      return
    }
    next()
  } catch (error) {
    next(error)
  }
}