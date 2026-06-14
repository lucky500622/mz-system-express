import { RowDataPacket, OkPacket } from 'mysql2'

import pool from '../config/db.ts'

// 添加申请
export const addApplyModel = async (apply_id: string, apply_user_id: string, approve_user_id: string, apply_role: string, connection: any): Promise<boolean> => {
  const exec = (connection || pool) as typeof pool
  const sql = `INSERT INTO t_apply_info(apply_id, apply_user_id, approve_user_id, apply_role) VALUES (?, ?, ?, ?)`
  const [res] = await exec.query<OkPacket>(sql, [apply_id, apply_user_id, approve_user_id, apply_role])
  return res.affectedRows > 0
}