import { body, query } from 'express-validator'
import validate from '../middleware/validate.ts'
import { queryUserNameModel } from '../model/user.ts'

// 用户注册校验
export const registerValidator = validate([
  body('user_name')
    .notEmpty().withMessage('用户名不能为空').bail()
    .isLength({ min: 3, max: 20 }).withMessage('用户名长度必须在3-20个字符之间').bail()
    .matches(/^[a-zA-Z0-9]+$/).withMessage('用户名只能包含字母和数字'),

  body('user_password')
    .notEmpty().withMessage('密码不能为空').bail()
    .isLength({ min: 6, max: 12 }).withMessage('密码长度必须在6-12个字符之间')
    .matches(/^[a-zA-Z0-9]+$/).withMessage('密码只能包含字母和数字').bail()
])

// 用户登录校验
export const loginValidator = validate([
  body('user_name')
    .notEmpty().withMessage('用户名不能为空').bail()
    .isLength({ min: 3, max: 20 }).withMessage('用户名长度必须在3-20个字符之间').bail()
    .matches(/^[a-zA-Z0-9]+$/).withMessage('用户名只能包含字母和数字').bail(),
  body('user_password')
    .notEmpty().withMessage('密码不能为空').bail()
    .isLength({ min: 6, max: 12 }).withMessage('密码长度必须在6-12个字符之间')
    .matches(/^[a-zA-Z0-9]+$/).withMessage('密码只能包含字母和数字').bail()
])

// 用户名查重校验
export const checkUsernameValidator = validate([
  query('user_name')
    .notEmpty().withMessage('用户名不能为空').bail()
])