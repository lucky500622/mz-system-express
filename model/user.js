import { v4 as uuidv4 } from 'uuid'

import pool from '../config/db.js'
import md5 from '../utils/md5.js'

// 用户名查重
export const queryUserNameModel = async (user_name) => {
  const sql = 'SELECT * FROM t_user WHERE user_name = ?'
  const [res] = await pool.query(sql, [user_name])
  return res.length > 0
}

// 用户注册
export const registerModel = async (user_name, user_password) => {
  // 生成随机ID
  const id = uuidv4()
  // 默认对应角色
  const role = 'staff'
  // 密码加密
  user_password = md5(user_password)

  const sql = 'INSERT INTO t_user VALUES(?, ?, ?, ?)'
  await pool.query(sql, [id, user_name, user_password, role])
}

// 用户登录
export const loginModel = async (user_name, user_password) => {
  // 密码加密
  user_password = md5(user_password)

  const sql = 'SELECT * FROM t_user WHERE user_name = ? AND user_password = ?'
  const [res] = await pool.query(sql, [user_name, user_password])

  if (res.length > 0) {
    // 生成随机token与过期时间
    const token = uuidv4()
    const expireData = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)

    const sql = 'INSERT INTO t_user_session(us_token, us_id, us_expire_time) VALUES(?, ?, ?)'
    await pool.query(sql, [token, res[0].user_id, expireData])
    return token
  } else {
    return null
  }
}