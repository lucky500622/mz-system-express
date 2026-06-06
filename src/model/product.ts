import { RowDataPacket, OkPacket } from 'mysql2'

import pool from '../config/db.ts'

// 分页获取产品信息
export const productPageInfoModel = async (offset: number, limit: number, m_id?: number, product_name?: string, product_type?: string, warehouse_m_id?: number, connection?: any): Promise<RowDataPacket[]> => {
  const exec = (connection || pool) as typeof pool
  // 拼接字段数组与值数组
  const fieldArr = []
  const valArr = []
  if (m_id) {
    fieldArr.push('t_product.m_id = ?')
    valArr.push(m_id)
  }
  if (product_name) {
    fieldArr.push('t_product.product_name LIKE ?')
    valArr.push(`%${product_name}%`)
  }
  if (product_type) {
    fieldArr.push('t_product.product_type LIKE ?')
    valArr.push(`%${product_type}%`)
  }
  if (warehouse_m_id) {
    fieldArr.push('t_warehouse.m_id = ?')
    valArr.push(warehouse_m_id)
  }
  const where = fieldArr.length > 0 ? 'AND ' : ''
  const sql = `SELECT t_product.m_id, t_warehouse.m_id AS warehouse_m_id, product_name, product_type, product_num, product_description FROM t_product INNER JOIN t_warehouse ON t_product.product_belong_id = t_warehouse.warehouse_id WHERE t_product.is_delete = 0 AND t_warehouse.is_delete = 0 ${where}${fieldArr.join(' AND ')} ORDER BY t_product.m_id DESC LIMIT ?, ?`
  const [res] = await exec.query<RowDataPacket[]>(sql, [...valArr, offset, limit])
  return res
}

// 分页获取产品操作信息
export const productPageActionInfoModel = async (offset: number, limit: number, m_id?: number, product_m_id?: number, product_name?: string, action_type?: number, user_name?: string, connection?: any): Promise<RowDataPacket[]> => {
  const exec = (connection || pool) as typeof pool
  // 拼接字段数组与值数组
  const fieldArr = []
  const valArr = []
  if (m_id) {
    fieldArr.push('t_issue_info.m_id = ?')
    valArr.push(m_id)
  }
  if (product_m_id) {
    fieldArr.push('t_product.m_id = ?')
    valArr.push(product_m_id)
  }
  if (product_name) {
    fieldArr.push('t_product.product_name LIKE ?')
    valArr.push(`%${product_name}%`)
  }
  if (action_type) {
    fieldArr.push('t_product_action_info.action_type = ?')
    valArr.push(action_type)
  }
  if (user_name) {
    fieldArr.push('t_user.user_name LIKE ?')
    valArr.push(`%${user_name}%`)
  }
  const where = fieldArr.length > 0 ? 'WHERE ' : ''
  const sql = `SELECT t_issue_info.m_id, t_product.m_id AS product_m_id, issue_create_time, user_name, product_name, action_type, action_num FROM t_issue_info INNER JOIN t_product_action_info ON t_issue_info.issue_id = t_product_action_info.issue_id INNER JOIN t_product ON t_product_action_info.product_id = t_product.product_id INNER JOIN t_user ON t_issue_info.user_id = t_user.user_id ${where}${fieldArr.join(' AND ')} ORDER BY t_issue_info.m_id DESC LIMIT ?, ?`
  const [res] = await exec.query<RowDataPacket[]>(sql, [...valArr, offset, limit])
  return res
}

// 新增产品操作信息
export const addProductActionInfoModel = async (issue_id: string, product_id: string, action_type: number, action_num: number, connection?: any): Promise<boolean> => {
  const exec = (connection || pool) as typeof pool
  // 拼接字段数组与值数组
  const sql = `INSERT INTO t_product_action_info(issue_id, product_id, action_type, action_num) VALUES(?, ?, ?, ?)`
  const [res] = await exec.query<OkPacket>(sql, [issue_id, product_id, action_type, action_num])
  return res.affectedRows > 0
}

// 新增产品
export const addProductModel = async (product_id: string, product_belong_id: string, product_name: string, product_type: string, product_num: number, product_description: string, connection?: any): Promise<boolean> => {
  const exec = (connection || pool) as typeof pool
  // 拼接字段数组与值数组
  const fieldArr = ['product_id', 'product_belong_id', 'product_name', 'product_num']
  const valArr: (string | number)[] = [product_id, product_belong_id, product_name, product_num]
  if (product_description) {
    fieldArr.push('product_description')
    valArr.push(product_description)
  }
  if (product_type) {
    fieldArr.push('product_type')
    valArr.push(product_type)
  }
  const sql = `INSERT INTO t_product(${fieldArr.join(', ')}) VALUES(${valArr.map(() => '?').join(', ')})`
  const [res] = await exec.query<OkPacket>(sql, valArr)
  return res.affectedRows > 0
}

// 获取产品信息
export const productInfoModel = async (m_id: number, connection?: any): Promise<RowDataPacket> => {
  const exec = (connection || pool) as typeof pool
  const sql = `SELECT * FROM t_product WHERE m_id = ? AND is_delete = 0`
  const [res] = await exec.query<RowDataPacket[]>(sql, [m_id])
  return res[0]
}

// 删除产品
export const deleteProductModel = async (m_id: number, connection?: any): Promise<boolean> => {
  const exec = (connection || pool) as typeof pool
  const sql = `UPDATE t_product SET is_delete = 1 WHERE m_id = ?`
  const [res] = await exec.query<OkPacket>(sql, [m_id])
  return res.affectedRows > 0
}

// 删除仓库下所属全部产品
export const deleteWarehouseProductModel = async (warehouse_id: string, connection?: any): Promise<boolean> => {
  const exec = (connection || pool) as typeof pool
  const sql = `UPDATE t_product SET is_delete = 1 WHERE product_belong_id = ?`
  const [res] = await exec.query<OkPacket>(sql, [warehouse_id])
  return res.affectedRows > 0
}

// 调整产品数量
export const adjustProductNumModel = async (m_id: number, product_num: number, connection?: any): Promise<boolean> => {
  const exec = (connection || pool) as typeof pool
  const sql = `UPDATE t_product SET product_num = ? WHERE m_id = ?`
  const [res] = await exec.query<OkPacket>(sql, [product_num, m_id])
  return res.affectedRows > 0
}