import { RowDataPacket, OkPacket } from 'mysql2'

import pool from '../config/db.ts'

// 查询某用户待办事项
export const getTodoModel = async (user_id: string, warehouse_id: string, connection?: any): Promise<RowDataPacket[]> => {
  const exec = (connection || pool) as typeof pool
  const sql = 'SELECT m_id, todo_content FROM t_todo_info WHERE user_id = ? AND warehouse_id = ? AND is_delete = 0'
  const [res] = await exec.query<RowDataPacket[]>(sql, [user_id, warehouse_id])
  return res
}

// 创建待办事项
export const createTodoModel = async (todo_id: string, user_id: string, warehouse_id: string, todo_content: string, connection?: any): Promise<boolean> => {
  const exec = (connection || pool) as typeof pool
  const sql = 'INSERT INTO t_todo_info (todo_id, user_id, warehouse_id, todo_content) VALUES (?, ?, ?, ?)'
  const [res] = await exec.query<OkPacket>(sql, [todo_id, user_id, warehouse_id, todo_content])
  return res.affectedRows > 0
}

// 删除待办事项
export const deleteTodoModel = async (m_id: number, connection?: any): Promise<boolean> => {
  const exec = (connection || pool) as typeof pool
  const sql = 'UPDATE t_todo_info SET is_delete = 1 WHERE m_id = ?'
  const [res] = await exec.query<OkPacket>(sql, [m_id])
  return res.affectedRows > 0
}