import { query } from 'express-validator'
import validate from '../middleware/validate.ts'

export const pageValidator = validate([
  query('offset')
    .notEmpty().withMessage('偏移量不能为空').bail()
    .isInt().withMessage('偏移量必须为整数'),
  query('limit')
    .notEmpty().withMessage('每页数量不能为空').bail()
    .isInt().withMessage('每页数量必须为整数'),
])