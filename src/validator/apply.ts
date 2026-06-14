import { query, body } from 'express-validator'
import validate from '../middleware/validate.ts'

// 添加申请校验
export const addApplyValidator = validate([
  body('approve_user_name')
    .isString().withMessage('审批用户名称必须为字符串'),
  body('apply_role')
    .isString().withMessage('申请角色必须为字符串').bail()
    .matches(/com_admin|staff/).withMessage('申请角色必须为com_admin或staff'),
])
