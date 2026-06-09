import express from 'express'
const router = express.Router()

import { getTodo, addTodo, deleteTodo } from '../controller/todo.ts'
import { addTodoValidator, deleteTodoValidator } from '../validator/todo.ts'

// 查询某用户待办事项
router.get('/', getTodo)

// 新增待办事项
router.post('/add', addTodoValidator, addTodo)

// 删除待办事项
router.patch('/delete', deleteTodoValidator, deleteTodo)

export default router
