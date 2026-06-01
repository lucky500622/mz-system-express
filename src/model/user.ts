import { RowDataPacket } from 'mysql2'

import pool from '../config/db.ts'

// 用户名查重
export const queryUserNameModel = async (user_name: string) => {
  const sql = 'SELECT * FROM t_user WHERE user_name = ?'
  const [res] = await pool.query<RowDataPacket[]>(sql, [user_name])
  return res.length > 0
}

// 用户注册
export const registerModel = async (id: string, user_name: string, user_password: string, role: string) => {
  const sql = 'INSERT INTO t_user VALUES(?, ?, ?, ?)'
  await pool.query(sql, [id, user_name, user_password, role])
}

// 用户登录检查
export const loginCheckModel = async (user_name: string, user_password: string) => {
  const sql = 'SELECT * FROM t_user WHERE user_name = ? AND user_password = ?'
  const [res] = await pool.query<RowDataPacket[]>(sql, [user_name, user_password])
  if (res.length > 0) return res[0].user_id
  return null
}

// 创建会话
export const createTokenModel = async (token: string, id: string, expireData: Date) => {
  const sql = 'INSERT INTO t_user_session(user_token, user_id, token_expire_time) VALUES(?, ?, ?)'
  await pool.query<RowDataPacket[]>(sql, [token, id, expireData])
}

// 用户信息获取
export const userInfoModel = async (token: string) => {
  const sql = 'SELECT user_name, user_role FROM t_user WHERE user_id = (SELECT user_id FROM t_user_session WHERE user_token = ?)'
  const [res] = await pool.query<RowDataPacket[]>(sql, [token])
  return res[0]
}