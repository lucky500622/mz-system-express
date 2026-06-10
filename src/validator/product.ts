import { body, query } from 'express-validator'
import validate from '../middleware/validate.ts'

// 产品查询校验
export const productInfoValidator = validate([
  query('m_id').optional()
    .isInt().withMessage('产品序列号必须是整数'),
  query('product_name').optional()
    .isString().withMessage('产品名称必须是字符串'),
  query('product_type').optional()
    .isString().withMessage('产品类型必须是字符串'),
  query('warehouse_m_id').optional()
    .isInt().withMessage('产品所属仓库序列号必须是整数')
])

// 产品操作信息查询校验
export const productActionInfoValidator = validate([
  query('m_id').optional()
    .isInt().withMessage('序列号必须是整数'),
  query('product_m_id').optional()
    .isInt().withMessage('产品序列号必须是整数'),
  query('product_name').optional()
    .isString().withMessage('产品名称必须是字符串'),
  query('action_type').optional()
    .isInt().withMessage('操作类型必须是整数'),
  query('user_name').optional()
    .isString().withMessage('用户名称必须是字符串')
])

// 新增产品校验
export const addProductValidator = validate([
  body('m_id')
    .notEmpty().withMessage('仓库序列号不能为空').bail()
    .isInt().withMessage('仓库序列号必须是整数'),
  body('product_name')
    .notEmpty().withMessage('产品名称不能为空').bail()
    .isString().withMessage('产品名称必须是字符串').bail()
    .isLength({ min: 2, max: 20 }).withMessage('产品名称长度必须在2-20个字符之间').bail()
    .matches(/^[\u4e00-\u9fa5a-zA-Z0-9]+$/).withMessage('产品名称只能包含中文、字母和数字'),
  body('product_num')
    .notEmpty().withMessage('产品数量不能为空').bail()
    .isInt({ min: 1 }).withMessage('产品数量必须是整数且大于等于1'),
  body('product_type').optional()
    .isString().withMessage('产品类型必须是字符串').bail()
    .isLength({ min: 2, max: 8 }).withMessage('产品类型长度必须在2-8个字符之间').bail()
    .matches(/^[\u4e00-\u9fa5]+$/).withMessage('产品类型只能包含中文'),
  body('product_description').optional()
    .isString().withMessage('产品描述必须是字符串').bail()
    .isLength({ min: 0, max: 200 }).withMessage('产品描述长度必须在0-200个字符之间')
])

// 删除产品校验
export const deleteProductValidator = validate([
  query('m_id')
    .notEmpty().withMessage('产品序列号不能为空').bail()
    .isInt().withMessage('产品序列号必须是整数')
])

// 调整产品数量校验
export const adjustProductNumValidator = validate([
  body('m_id')
    .notEmpty().withMessage('产品序列号不能为空').bail()
    .isInt().withMessage('产品序列号必须是整数'),
  body('action_type')
    .notEmpty().withMessage('操作类型不能为空').bail()
    .isInt().withMessage('操作类型必须是整数'),
  body('product_num')
    .notEmpty().withMessage('产品数量不能为空').bail()
    .isInt({ min: 1 }).withMessage('产品数量必须是整数且大于等于1')
])

// 编辑产品描述校验
export const editProductDescriptionValidator = validate([
  body('m_id')
    .notEmpty().withMessage('产品序列号不能为空').bail()
    .isInt().withMessage('产品序列号必须是整数'),
  body('description')
    .notEmpty().withMessage('产品描述不能为空').bail()
    .isString().withMessage('产品描述必须是字符串').bail()
    .isLength({ min: 0, max: 200 }).withMessage('产品描述长度必须在0-200个字符之间')
])

// 获取产品名称校验
export const productNameValidator = validate([
  query('text')
    .notEmpty().withMessage('搜索文本不能为空').bail()
    .isString().withMessage('搜索文本必须是字符串'),
  query('limit').optional()
    .isInt({ min: 1, max: 100 }).withMessage('限制数量必须在1-100之间')
])

// 上下架产品校验
export const listProductValidator = validate([
  body('m_id')
    .notEmpty().withMessage('产品序列号不能为空').bail()
    .isInt().withMessage('产品序列号必须是整数'),
  body('action_type')
    .notEmpty().withMessage('操作类型不能为空').bail()
    .isInt().withMessage('操作类型必须是整数'),
  body('product_num').optional()
    .isInt({ min: 1 }).withMessage('产品数量必须是整数且大于等于1'),
  body('action_all')
    .notEmpty().withMessage('是否全部操作不能为空').bail()
    .isBoolean().withMessage('是否全部操作必须是布尔值')
])