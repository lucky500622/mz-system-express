import { Controller } from '../types/express.ts'

export const checkAdminAuth: Controller<void> = async (req, res, next) => {
  try {
    if (res.locals.userInfo.user_role !== 'sup_admin') {
      if (res.locals.userInfo.user_role !== 'com_admin') {
        res.status(402).json({
          message: '权限不足',
        })
        return
      }
    }

    next()
  } catch (error) {
    next(error)
  }
}