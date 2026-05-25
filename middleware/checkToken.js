import { checkTokenModel, updateTokenStatusModel } from '../model/token.js'

export const checkToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
    if (!token) return res.status(401).json({
      message: 'token不能为空',
    })
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