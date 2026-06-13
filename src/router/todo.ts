import express from 'express'
const router = express.Router()

import { getTodo, addTodo, deleteTodo } from '../controller/todo.ts'
import { addTodoValidator, deleteTodoValidator } from '../validator/todo.ts'
import { checkStaffAuth } from '../middleware/checkStaffAuth.ts'

// 查询某用户待办事项
router.get('/', getTodo)

// 新增待办事项
router.post('/add', checkStaffAuth, addTodoValidator, addTodo)

// 删除待办事项
router.patch('/delete', checkStaffAuth, deleteTodoValidator, deleteTodo)

export default router
