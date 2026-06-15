import { query, body } from 'express-validator'
import validate from '../middleware/validate.ts'

// 添加申请校验
export const addApplyValidator = validate([
  body('approve_user_name')
    .notEmpty().withMessage('审批用户名称不能为空').bail()
    .isString().withMessage('审批用户名称必须为字符串'),
  body('apply_role')
    .notEmpty().withMessage('申请角色不能为空').bail()
    .isString().withMessage('申请角色必须为字符串').bail()
    .matches(/com_admin|staff/).withMessage('申请角色必须为com_admin或staff'),
])

// 审批申请校验
export const approveApplyValidator = validate([
  body('apply_status')
    .notEmpty().withMessage('审批状态不能为空').bail()
    .isInt().withMessage('审批状态必须为整数'),
  body('apply_role')
    .notEmpty().withMessage('审批角色不能为空').bail()
    .isString().withMessage('审批角色必须为字符串'),
  body('m_id')
    .notEmpty().withMessage('审批序列号不能为空').bail()
    .isInt().withMessage('审批序列号必须为整数'),
])