import { RowDataPacket } from 'mysql2'

import pool from '../config/db.ts'

// 分页获取仓库操作信息
export const actionInfoModel = async (offset: number, limit: number) => {
  const sql = 'SELECT t_issue_info.m_id, t_issue_info.issue_object, issue_create_time, user_name, warehouse_name, action_type, warehouse_rename FROM t_issue_info INNER JOIN t_warehouse_action_info ON t_issue_info.issue_id = t_warehouse_action_info.issue_id INNER JOIN t_warehouse ON t_warehouse_action_info.warehouse_id = t_warehouse.warehouse_id INNER JOIN t_user ON t_issue_info.user_id = t_user.user_id ORDER BY t_issue_info.m_id ASC LIMIT ?, ?'
  const [res] = await pool.query<RowDataPacket[]>(sql, [offset, limit])
  return res
}

// 分页获取商品操作信息
export const productActionInfoModel = async (offset: number, limit: number) => {
  const sql = 'SELECT t_issue_info.m_id, t_issue_info.issue_object, issue_create_time, user_name, product_name, action_type, action_num FROM t_issue_info INNER JOIN t_product_action_info ON t_issue_info.issue_id = t_product_action_info.issue_id INNER JOIN t_product ON t_product_action_info.product_id = t_product.product_id INNER JOIN t_user ON t_issue_info.user_id = t_user.user_id ORDER BY t_issue_info.m_id ASC LIMIT ?, ?'
  const [res] = await pool.query<RowDataPacket[]>(sql, [offset, limit])
  return res
}