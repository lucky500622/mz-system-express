import { body } from 'express-validator'
import validate from '../middleware/validate.ts'

// 新增仓库校验
export const addWarehouseValidator = validate([
  body('warehouse_name')
    .notEmpty().withMessage('仓库名称不能为空').bail()
    .isString().withMessage('仓库名称必须是字符串').bail()
    .isLength({ min: 2, max: 20 }).withMessage('仓库名称长度必须在2-20个字符之间').bail()
    .matches(/^[\u4e00-\u9fa5a-zA-Z0-9]+$/).withMessage('仓库名称只能包含中文、字母和数字'),
  body('warehouse_type').optional()
    .isString().withMessage('仓库类型必须是字符串').bail()
    .isLength({ min: 2, max: 20 }).withMessage('仓库类型长度必须在2-20个字符之间').bail()
    .matches(/^[\u4e00-\u9fa5]+$/).withMessage('仓库类型只能包含中文'),
  body('warehouse_description').optional()
    .isString().withMessage('仓库描述必须是字符串').bail()
    .isLength({ min: 0, max: 200 }).withMessage('仓库描述长度必须在0-200个字符之间')
])

// 编辑仓库校验
export const editWarehouseValidator = validate([
  body('m_id')
    .notEmpty().withMessage('仓库ID不能为空').bail()
    .isInt().withMessage('仓库ID必须是整数'),
  body('warehouse_name')
    .notEmpty().withMessage('仓库名称不能为空').bail()
    .isString().withMessage('仓库名称必须是字符串').bail()
    .isLength({ min: 2, max: 20 }).withMessage('仓库名称长度必须在2-20个字符之间').bail()
    .matches(/^[\u4e00-\u9fa5a-zA-Z0-9]+$/).withMessage('仓库ID只能包含中文、字母和数字'),
])