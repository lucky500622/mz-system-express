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
  const sql = `
  SELECT t_product.m_id, t_warehouse.m_id AS warehouse_m_id, product_name, product_type, product_num, product_list_num, product_diff_num, product_description 
    FROM t_product INNER JOIN t_warehouse ON t_product.product_belong_id = t_warehouse.warehouse_id
    WHERE t_product.is_delete = 0 AND t_warehouse.is_delete = 0 ${where}${fieldArr.join(' AND ')}
    ORDER BY t_product.m_id DESC LIMIT ?, ?`
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
  const sql = `
  SELECT t_issue_info.m_id, t_product.m_id AS product_m_id, issue_create_time, user_name, product_name, action_type, action_num FROM t_issue_info 
    INNER JOIN t_product_action_info ON t_issue_info.issue_id = t_product_action_info.issue_id
    INNER JOIN t_product ON t_product_action_info.product_id = t_product.product_id
    INNER JOIN t_user ON t_issue_info.user_id = t_user.user_id
  ${where}${fieldArr.join(' AND ')}
  ORDER BY t_issue_info.m_id DESC LIMIT ?, ?`
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

// 编辑产品描述
export const editProductDescriptionModel = async (m_id: number, product_description: string, connection?: any): Promise<boolean> => {
  const exec = (connection || pool) as typeof pool
  const sql = `UPDATE t_product SET product_description = ? WHERE m_id = ?`
  const [res] = await exec.query<OkPacket>(sql, [product_description, m_id])
  return res.affectedRows > 0
}

// 获取产品名称
export const productNameModel = async (text: string, limit: number, connection?: any): Promise<RowDataPacket[]> => {
  const exec = (connection || pool) as typeof pool
  const sql = `
  SELECT product_name AS name FROM t_product
  WHERE product_name LIKE ? AND is_delete = 0
  ORDER BY RAND() LIMIT ?`
  const [res] = await exec.query<RowDataPacket[]>(sql, [`%${text}%`, limit])
  return res
}

// 获取某个仓库下所属全部产品信息
export const warehouseProductModel = async (m_id: number, product_m_id?: number, product_name?: string, product_type?: string, connection?: any): Promise<RowDataPacket[]> => {
  const exec = (connection || pool) as typeof pool
  // 拼接查询条件
  const fieldArr = ['t_warehouse.m_id = ?']
  // 拼接值数组
  const valArr: (string | number)[] = [m_id]
  if (product_m_id) {
    fieldArr.push('t_product.m_id = ?')
    valArr.push(product_m_id)
  }
  if (product_name) {
    fieldArr.push('t_product.product_name LIKE ?')
    valArr.push(`%${product_name}%`)
  }
  if (product_type) {
    fieldArr.push('t_product.product_type LIKE ?')
    valArr.push(`%${product_type}%`)
  }

  const sql = `
  SELECT t_product.m_id, product_name, product_type, product_num, product_description, product_list_num, product_diff_num, COUNT(IF(product_num IS NULL OR product_num = 0, NULL, 1)) AS product_count, COUNT(IF(product_list_num IS NULL OR product_diff_num = 0, NULL, 1)) AS listed_product_num 
    FROM t_warehouse 
    LEFT OUTER JOIN t_product ON t_warehouse.warehouse_id = t_product.product_belong_id AND t_product.is_delete = 0 
  WHERE ${fieldArr.join(' AND ')}
  GROUP BY t_product.m_id`
  const [res] = await exec.query<RowDataPacket[]>(sql, valArr)
  return res
}

// 上下架产品数量调整
export const listProductModel = async (m_id: number, product_list_num: number, connection?: any): Promise<boolean> => {
  const exec = (connection || pool) as typeof pool
  const sql = `UPDATE t_product SET product_list_num = ? WHERE m_id = ?`
  const [res] = await exec.query<OkPacket>(sql, [product_list_num, m_id])
  return res.affectedRows > 0
}

// 下架某个仓库下所有产品
export const downListAllProductsModel = async (m_id: number, connection?: any): Promise<boolean> => {
  const exec = (connection || pool) as typeof pool
  const sql = `
  UPDATE t_product INNER JOIN t_warehouse ON t_product.product_belong_id = t_warehouse.warehouse_id AND t_product.is_delete = 0 
    SET product_list_num = 0 
  WHERE t_warehouse.m_id = ? `
  const [res] = await exec.query<OkPacket>(sql, [m_id])
  return true
}

// 获取产品概览信息
export const productOverviewModel = async (connection?: any): Promise<RowDataPacket> => {
  const exec = (connection || pool) as typeof pool
  const sql = `
  SELECT COUNT(m_id) AS count, SUM(product_num) AS total_product_num, SUM(product_list_num) AS listed_product_num 
  FROM t_product 
  WHERE is_delete = 0`
  const [res] = await exec.query<RowDataPacket[]>(sql)
  return res[0]
}

// 获取最近七天产品新增总量、减少总量、售出总量操作信息
export const productDayActionInfoModel = async (connection?: any): Promise<RowDataPacket> => {
  const exec = (connection || pool) as typeof pool
  const sql = `
  SELECT
    GROUP_CONCAT(IFNULL(stat.in_total,0) ORDER BY dl.days_ago DESC SEPARATOR ',') AS in_arr,
    GROUP_CONCAT(IFNULL(stat.out_total,0) ORDER BY dl.days_ago DESC SEPARATOR ',') AS out_arr,
    GROUP_CONCAT(IFNULL(stat.sale_total,0) ORDER BY dl.days_ago DESC SEPARATOR ',') AS sale_arr
  FROM (
    SELECT 0 days_ago UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6
  ) dl LEFT JOIN (
    SELECT
      DATEDIFF(CURDATE(), DATE(issue_create_time)) AS days_ago,
      SUM(IF(action_type IN (1,3), action_num, 0)) AS in_total,
      SUM(IF(action_type IN (2,4), action_num, 0)) AS out_total,
      SUM(IF(action_type = 7, action_num, 0)) AS sale_total
    FROM t_product_action_info INNER JOIN t_issue_info ON t_product_action_info.issue_id = t_issue_info.issue_id
    WHERE DATEDIFF(CURDATE(), DATE(issue_create_time)) BETWEEN 0 AND 6
    GROUP BY days_ago
  ) stat ON dl.days_ago = stat.days_ago`
  const [res] = await exec.query<RowDataPacket[]>(sql)
  return res[0]
}

// 获取需要预警的产品
export const productWarningModel = async (connection?: any): Promise<RowDataPacket[]> => {
  const exec = (connection || pool) as typeof pool
  const sql = `
  SELECT t_product.m_id, t_product.product_name, t_product.m_id AS product_m_id, t_warehouse.warehouse_name, t_product.product_diff_num, t_product.product_list_num
    FROM t_warehouse INNER JOIN t_product ON t_warehouse.warehouse_id = t_product.product_belong_id AND t_product.is_delete = 0 AND t_warehouse.is_delete = 0 
    WHERE t_product.product_diff_num <= 100 AND t_product.product_list_num <> 0`
  const [res] = await exec.query<RowDataPacket[]>(sql)
  return res
}