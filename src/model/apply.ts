import { RowDataPacket, OkPacket } from 'mysql2'

import pool from '../config/db.ts'

// 添加申请
export const addApplyModel = async (apply_id: string, apply_user_id: string, approve_user_id: string, apply_role: string, connection: any): Promise<boolean> => {
  const exec = (connection || pool) as typeof pool
  const sql = `INSERT INTO t_apply_info(apply_id, apply_user_id, approve_user_id, apply_role) VALUES (?, ?, ?, ?)`
  const [res] = await exec.query<OkPacket>(sql, [apply_id, apply_user_id, approve_user_id, apply_role])
  return res.affectedRows > 0
}

// 获取申请列表
export const getApplyListModel = async (connection?: any): Promise<RowDataPacket[]> => {
  const exec = (connection || pool) as typeof pool
  const sql = `
  SELECT t_apply_info.m_id, t_apply_info.apply_role, t_apply_info.apply_create_time, t_user.user_name 
  FROM t_apply_info 
    INNER JOIN t_user 
    ON t_apply_info.apply_user_id = t_user.user_id
  WHERE t_apply_info.apply_status = 0`
  const [res] = await exec.query<RowDataPacket[]>(sql)
  return res
}

// 判断是否已存在申请
export const isApplyExistModel = async (apply_user_id: string, connection?: any): Promise<boolean> => {
  const exec = (connection || pool) as typeof pool
  const sql = `SELECT COUNT(*) AS count FROM t_apply_info WHERE apply_user_id = ? AND apply_status = 0`
  const [res] = await exec.query<RowDataPacket[]>(sql, [apply_user_id])
  return res[0].count > 0
}

// 审批申请
export const approveApplyModel = async (m_id: number, apply_status: number, connection?: any): Promise<boolean> => {
  const exec = (connection || pool) as typeof pool
  const sql = `UPDATE t_apply_info SET apply_status = ? WHERE m_id = ?`
  const [res] = await exec.query<OkPacket>(sql, [apply_status, m_id])
  return res.affectedRows > 0
}
