import { body, query } from 'express-validator'
import validate from '../middleware/validate.ts'

// 查询仓库校验
export const warehouseInfoValidator = validate([
  query('m_id').optional()
    .isInt().withMessage('仓库序列号必须是整数'),
  query('warehouse_name').optional()
    .isString().withMessage('仓库名称必须是字符串'),
  query('warehouse_type').optional()
    .isString().withMessage('仓库类型必须是字符串'),
  query('user_name').optional()
    .isString().withMessage('用户名称必须是字符串')
])

// 查询仓库操作信息校验
export const warehouseActionInfoValidator = validate([
  query('m_id').optional()
    .isInt().withMessage('序列号必须是整数'),
  query('warehouse_m_id').optional()
    .isInt().withMessage('仓库序列号必须是整数'),
  query('warehouse_name').optional()
    .isString().withMessage('仓库名称必须是字符串'),
  query('action_type').optional()
    .isInt().withMessage('操作类型必须是整数'),
  query('user_name').optional()
    .isString().withMessage('用户名称必须是字符串')
])

// 查询某个仓库信息校验
export const oneWarehouseInfoValidator = validate([
  query('m_id')
    .notEmpty().withMessage('仓库序列号不能为空').bail()
    .isInt().withMessage('仓库序列号必须是整数')
])

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
    .notEmpty().withMessage('仓库序列号不能为空').bail()
    .isInt().withMessage('仓库序列号必须是整数'),
  body('warehouse_name')
    .notEmpty().withMessage('仓库名称不能为空').bail()
    .isString().withMessage('仓库名称必须是字符串').bail()
    .isLength({ min: 2, max: 20 }).withMessage('仓库名称长度必须在2-20个字符之间').bail()
    .matches(/^[\u4e00-\u9fa5a-zA-Z0-9]+$/).withMessage('仓库名称只能包含中文、字母和数字'),
])

// 编辑仓库描述校验
export const editWarehouseDescriptionValidator = validate([
  body('m_id')
    .notEmpty().withMessage('仓库序列号不能为空').bail()
    .isInt().withMessage('仓库序列号必须是整数'),
  body('description')
    .notEmpty().withMessage('仓库描述不能为空').bail()
    .isString().withMessage('仓库描述必须是字符串').bail()
    .isLength({ min: 0, max: 200 }).withMessage('仓库描述长度必须在0-200个字符之间')
])

// 删除仓库校验
export const deleteWarehouseValidator = validate([
  query('m_id')
    .notEmpty().withMessage('仓库序列号不能为空').bail()
    .isInt().withMessage('仓库序列号必须是整数'),
])

// 获取仓库名校验
export const randomWarehouseNameValidator = validate([
  query('text')
    .notEmpty().withMessage('搜索文本不能为空').bail()
    .isString().withMessage('搜索文本必须是字符串'),
  query('limit').optional()
    .isInt({ min: 1, max: 100 }).withMessage('限制数量必须在1-100之间')
])

// 新增经手仓库校验
export const addHandleWarehouseValidator = validate([
  body('m_id')
    .notEmpty().withMessage('仓库序列号不能为空').bail()
    .isInt().withMessage('仓库序列号必须是整数'),
])