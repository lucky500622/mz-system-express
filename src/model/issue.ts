import { RowDataPacket } from 'mysql2'

import pool from '../config/db.ts'

// 新增操作信息
export const addIssueInfoModel = async (issue_id: string, user_id: string, connection?: any) => {
  const exec = (connection || pool) as typeof pool
  const sql = 'INSERT INTO t_issue_info(issue_id, user_id) VALUES(?, ?)'
  const [res] = await exec.query<RowDataPacket[]>(sql, [issue_id, user_id])
  return res.length > 0
}
