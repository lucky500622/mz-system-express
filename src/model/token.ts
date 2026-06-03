import { RowDataPacket, OkPacket } from 'mysql2'

import pool from '../config/db.ts'

// 检查token是否过期
export const checkTokenModel = async (token: string, connection?: any): Promise<boolean> => {
  const exec = (connection || pool) as typeof pool
  const sql = 'SELECT * FROM t_user_session WHERE user_token = ? AND token_status = 1 AND token_expire_time > NOW()'
  const [res] = await exec.query<RowDataPacket[]>(sql, [token])
  return res.length > 0
}

// 更新token状态为已过期
export const updateTokenStatusModel = async (token: string, connection?: any): Promise<boolean> => {
  const exec = (connection || pool) as typeof pool
  const sql = 'UPDATE t_user_session SET token_status = 0 WHERE user_token = ?'
  const [res] = await exec.query<OkPacket>(sql, [token])
  return res.affectedRows > 0
}
