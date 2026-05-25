import pool from '../config/db.js'

// 用户名查重
export const queryUserNameModel = async (user_name) => {
  const sql = 'SELECT * FROM t_user WHERE user_name = ?'
  const [res] = await pool.query(sql, [user_name])
  return res.length > 0
}

// 用户注册
export const registerModel = async (id, user_name, user_password, role) => {
  const sql = 'INSERT INTO t_user VALUES(?, ?, ?, ?)'
  await pool.query(sql, [id, user_name, user_password, role])
}

// 用户登录检查
export const loginCheckModel = async (user_name, user_password) => {
  const sql = 'SELECT * FROM t_user WHERE user_name = ? AND user_password = ?'
  const [res] = await pool.query(sql, [user_name, user_password])
  if (res.length > 0) return res[0].user_id
  return null
}

// 创建会话
export const createTokenModel = async (token, id, expireData) => {
  const sql = 'INSERT INTO t_user_session(us_token, us_id, us_expire_time) VALUES(?, ?, ?)'
  await pool.query(sql, [token, id, expireData])
}