import { RowDataPacket } from 'mysql2'

import pool from '../config/db.ts'

// 分页获取仓库信息
export const warehouseInfoModel = async (offset: number, limit: number) => {
  const sql = 'SELECT m_id, warehouse_name, warehouse_type, warehouse_creater, warehouse_description, warehouse_create_time FROM t_warehouse WHERE is_delete = 0 ORDER BY m_id ASC LIMIT ?, ?'
  const [res] = await pool.query<RowDataPacket[]>(sql, [offset, limit])
  return res
}
