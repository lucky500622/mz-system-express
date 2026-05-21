import { body } from 'express-validator'
import validate from '../middleware/validate.js'
import { queryUserNameModel } from '../model/user.js'

// 用户注册校验
export const registerValidator = validate([
  body('user_name')
    .notEmpty().withMessage('用户名不能为空').bail()
    .isLength({ min: 3, max: 20 }).withMessage('用户名长度必须在3-20个字符之间').bail()
    .custom(async (username) => {
      const flag = await queryUserNameModel(username)
      if (flag) throw new Error('用户名已存在')
    }),

  body('user_password')
    .notEmpty().withMessage('密码不能为空').bail()
    .isLength({ min: 6, max: 12 }).withMessage('密码长度必须在6-12个字符之间')
])
