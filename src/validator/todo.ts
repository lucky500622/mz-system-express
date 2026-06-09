import { body, query } from 'express-validator'
import validate from '../middleware/validate.ts'

// 查询用户待办事项校验
export const getTodoValidator = validate([
  query('m_id')
    .notEmpty().withMessage('仓库序列号不能为空').bail()
    .isInt().withMessage('仓库序列号必须是整数')
])

// 新增待办事项校验
export const addTodoValidator = validate([
  query('m_id')
    .notEmpty().withMessage('仓库序列号不能为空').bail()
    .isInt().withMessage('仓库序列号必须是整数'),
  body('todo_content')
    .notEmpty().withMessage('待办事项内容不能为空').bail()
    .isString().withMessage('待办事项内容必须是字符串')
])

// 删除待办事项校验
export const deleteTodoValidator = validate([
  query('m_id')
    .notEmpty().withMessage('仓库序列号不能为空').bail()
    .isInt().withMessage('仓库序列号必须是整数'),
  query('todo_m_id')
    .notEmpty().withMessage('待办事项序列号不能为空').bail()
    .isInt().withMessage('待办事项序列号必须是整数')
])
