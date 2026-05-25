import pool from '../config/db.js'

// 检查token是否过期
export const checkTokenModel = async (token) => {
  const sql = 'SELECT * FROM t_user_session WHERE us_token = ? AND us_status = 1 AND us_expire_time > NOW()'
  const [res] = await pool.query(sql, [token])
  return res.length > 0
}

// 更新token状态为已过期
export const updateTokenStatusModel = async (token) => {
  const sql = 'UPDATE t_user_session SET us_status = 0 WHERE us_token = ?'
  await pool.query(sql, [token])
}
