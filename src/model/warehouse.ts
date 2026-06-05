import { RowDataPacket, OkPacket } from 'mysql2'

import pool from '../config/db.ts'

// 分页获取仓库信息
export const warehousePageInfoModel = async (offset: number, limit: number, connection?: any): Promise<RowDataPacket[]> => {
  const exec = (connection || pool) as typeof pool
  const sql = 'SELECT m_id, warehouse_name_ed, warehouse_name, warehouse_type, user_name, warehouse_description, warehouse_create_time FROM t_warehouse INNER JOIN t_user ON t_warehouse.warehouse_creater_id = t_user.user_id WHERE is_delete = 0 ORDER BY m_id DESC LIMIT ?, ?'
  const [res] = await exec.query<RowDataPacket[]>(sql, [offset, limit])
  return res
}

// 分页获取仓库操作信息
export const warehousePageActionInfoModel = async (offset: number, limit: number, connection?: any): Promise<RowDataPacket[]> => {
  const exec = (connection || pool) as typeof pool
  const sql = 'SELECT t_issue_info.m_id, t_warehouse.m_id AS warehouse_m_id, issue_create_time, user_name, t_warehouse_action_info.warehouse_name, action_type FROM t_issue_info INNER JOIN t_warehouse_action_info ON t_issue_info.issue_id = t_warehouse_action_info.issue_id INNER JOIN t_warehouse ON t_warehouse_action_info.warehouse_id = t_warehouse.warehouse_id INNER JOIN t_user ON t_issue_info.user_id = t_user.user_id ORDER BY t_issue_info.m_id DESC LIMIT ?, ?'
  const [res] = await exec.query<RowDataPacket[]>(sql, [offset, limit])
  return res
}

// 新增仓库操作信息
export const addWareActionInfoModel = async (issue_id: string, warehouse_id: string, action_type: number, warehouse_name: string, connection?: any): Promise<boolean> => {
  const exec = (connection || pool) as typeof pool
  const sql = 'INSERT INTO t_warehouse_action_info (issue_id, warehouse_id, action_type, warehouse_name) VALUES (?, ?, ?, ?)'
  const [res] = await exec.query<OkPacket>(sql, [issue_id, warehouse_id, action_type, warehouse_name])
  return res.affectedRows > 0
}

// 获取仓库信息
export const warehouseInfoModel = async (m_id: number, connection?: any): Promise<RowDataPacket> => {
  const exec = (connection || pool) as typeof pool
  const sql = 'SELECT t_warehouse.m_id, warehouse_id, warehouse_name, warehouse_create_time, warehouse_name_ed, COUNT(t_product.product_num) AS product_num FROM t_warehouse LEFT OUTER JOIN t_product ON t_warehouse.warehouse_id = t_product.product_belong_id AND t_product.is_delete = 0 WHERE t_warehouse.m_id = ? AND t_warehouse.is_delete = 0 GROUP BY t_warehouse.m_id'
  const [res] = await exec.query<RowDataPacket[]>(sql, [m_id])
  return res[0]
}

// 仓库名查重
export const warehouseNameCheckModel = async (warehouse_name: string, connection?: any): Promise<boolean> => {
  const exec = (connection || pool) as typeof pool
  const sql = 'SELECT warehouse_name FROM t_warehouse WHERE warehouse_name = ? AND is_delete = 0'
  const [res] = await exec.query<RowDataPacket[]>(sql, [warehouse_name])
  return res.length > 0
}

// 新增仓库
export const addWarehouseModel = async (warehouse_id: string, warehouse_name: string, user_id: string, warehouse_type?: string, warehouse_description?: string, connection?: any): Promise<boolean> => {
  const exec = (connection || pool) as typeof pool
  // 拼接字段数组与值数组
  const fieldArr = ['warehouse_id', 'warehouse_name', 'warehouse_creater_id']
  const valArr = [warehouse_id, warehouse_name, user_id]
  if (warehouse_type) {
    fieldArr.push('warehouse_type')
    valArr.push(warehouse_type)
  }
  if (warehouse_description) {
    fieldArr.push('warehouse_description')
    valArr.push(warehouse_description)
  }
  const sql = `INSERT INTO t_warehouse(${fieldArr.join(', ')}) VALUES(${valArr.map(() => '?').join(', ')})`
  const [res] = await exec.query<OkPacket>(sql, valArr)
  return res.affectedRows > 0
}

// 仓库编辑功能
export const editWarehouseModel = async (m_id: number, warehouse_name_ed: string, warehouse_name: string, connection?: any): Promise<boolean> => {
  const exec = (connection || pool) as typeof pool
  const sql = `UPDATE t_warehouse SET warehouse_name_ed = ?, warehouse_name = ? WHERE m_id = ?`
  const [res] = await exec.query<OkPacket>(sql, [warehouse_name_ed, warehouse_name, m_id])
  return res.affectedRows > 0
}

// 仓库删除功能
export const deleteWarehouseModel = async (m_id: number, connection?: any): Promise<boolean> => {
  const exec = (connection || pool) as typeof pool
  const sql = `UPDATE t_warehouse SET is_delete = 1 WHERE m_id = ?`
  const [res] = await exec.query<OkPacket>(sql, [m_id])
  return res.affectedRows > 0
}