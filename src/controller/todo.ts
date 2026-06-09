import { v4 as uuidv4 } from 'uuid'

import { Controller } from '../types/express.ts'

import { getTodoModel, createTodoModel, deleteTodoModel } from '../model/todo.ts'

// 查询某用户待办事项
export const getTodo: Controller<void> = async (req, res, next) => {
  try {
    // 获取待办事项
    const todo = await getTodoModel(res.locals.userInfo.user_id, res.locals.warehouseInfo.warehouse_id)

    res.json({
      code: 200,
      message: '查询成功',
      data: {
        todoList: todo
      }
    })

  } catch (err) {
    next(err)
  }
}

// 新增待办事项
export const addTodo: Controller<void> = async (req, res, next) => {
  try {
    // 新增待办事项
    const { todo_content } = req.body
    const todo_id = uuidv4()
    await createTodoModel(todo_id, res.locals.userInfo.user_id, res.locals.warehouseInfo.warehouse_id, todo_content)

    res.json({
      code: 200,
      message: '新增成功'
    })

  } catch (err) {
    next(err)
  }
}

// 删除待办事项
export const deleteTodo: Controller<void> = async (req, res, next) => {
  try {
    // 删除待办事项
    const { m_id } = req.query
    await deleteTodoModel(Number(m_id))

    res.json({
      code: 200,
      message: '删除成功'
    })

  } catch (err) {
    next(err)
  }
}