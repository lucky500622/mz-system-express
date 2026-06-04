import { body } from 'express-validator'
import validate from '../middleware/validate.ts'

// 新增产品校验
export const addProductValidator = validate([
  body('m_id')
    .notEmpty().withMessage('仓库ID不能为空').bail()
    .isInt().withMessage('仓库ID必须是整数'),
  body('product_name')
    .notEmpty().withMessage('商品名称不能为空').bail()
    .isString().withMessage('商品名称必须是字符串').bail()
    .isLength({ min: 2, max: 20 }).withMessage('商品名称长度必须在2-20个字符之间').bail()
    .matches(/^[\u4e00-\u9fa5a-zA-Z0-9]+$/).withMessage('商品名称只能包含中文、字母和数字'),
  body('product_type').optional()
    .isString().withMessage('商品类型必须是字符串').bail()
    .isLength({ min: 2, max: 8 }).withMessage('商品类型长度必须在2-8个字符之间').bail()
    .matches(/^[\u4e00-\u9fa5]+$/).withMessage('商品类型只能包含中文'),
  body('product_num')
    .notEmpty().withMessage('商品数量不能为空').bail()
    .isInt().withMessage('商品数量必须是整数'),
  body('product_description').optional()
    .isString().withMessage('商品描述必须是字符串').bail()
    .isLength({ min: 0, max: 200 }).withMessage('商品描述长度必须在0-200个字符之间')
])

// 删除产品校验
export const deleteProductValidator = validate([
  body('m_id')
    .notEmpty().withMessage('商品ID不能为空').bail()
    .isInt().withMessage('商品ID必须是整数')
])