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
  user_password = md5('ljycss' + user_password)

  // 新建数据库连接
  const connection = await pool.getConnection()
  try {
    // 开启事务
    await connection.beginTransaction()
    // 执行注册操作
    const sql = 'INSERT INTO t_user VALUES(?, ?, ?, ?)'
    const [res] = await connection.query(sql, [id, user_name, user_password, role])
    // 提交事务
    await connection.commit()
    // 返回注册结果
    return res
  } catch (err) {
    // 回滚事务
    await connection.rollback()
    // 抛出错误
    throw err
  }
}