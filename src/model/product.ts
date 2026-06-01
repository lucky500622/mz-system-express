import { RowDataPacket } from 'mysql2'

import pool from '../config/db.ts'

// 分页获取商品信息
export const productInfoModel = async (offset: number, limit: number) => {
  const sql = 'SELECT m_id, product_name, product_type, product_num, product_description FROM t_product ORDER BY m_id ASC LIMIT ?, ?'
  const [res] = await pool.query<RowDataPacket[]>(sql, [offset, limit])
  return res
}
