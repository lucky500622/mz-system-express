import { Controller } from '../types/express.ts'

export const checkStaffAuth: Controller<void> = async (req, res, next) => {
  try {
    if (res.locals.userInfo.user_role !== 'sup_admin') {
      if (res.locals.userInfo.user_role !== 'staff') {
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