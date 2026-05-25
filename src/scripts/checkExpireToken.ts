import { OkPacket } from 'mysql2/promise'

import pool from '../config/db.ts'

// 批量检查token是否过期
export const checkAllExpireToken = async () => {
  const sql = 'UPDATE t_user_session SET us_status = 0 WHERE us_expire_time < NOW() AND us_status = 1'
  const [res] = await pool.query<OkPacket>(sql)
  return res.affectedRows
}