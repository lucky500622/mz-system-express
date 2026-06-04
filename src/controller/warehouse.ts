import { v4 as uuidv4 } from 'uuid'

import { Controller } from '../types/express.ts'
import pool from '../config/db.ts'

import { getToken } from '../utils/getToken.ts'
import { userInfoModel } from '../model/user.ts'
import { warehousePageInfoModel, addWarehouseModel, warehousePageActionInfoModel, addWareActionInfoModel, warehouseNameCheckModel } from '../model/warehouse.ts'
import { addIssueInfoModel } from '../model/issue.ts'

// 分页获取仓库信息
export const warehousePageInfo: Controller<void> = async (req, res, next) => {
  try {
    const { offset = 0, limit = 10 } = req.query
    const pageOffset = Number(offset)
    const pageLimit = Number(limit)
    const warehouseInfo = await warehousePageInfoModel(pageOffset, pageLimit)
    res.json({
      code: 200,
      message: '仓库信息获取成功',
      data: {
        warehouseInfo
      }
    })
  } catch (err) {
    next(err)
  }
}

// 分页获取仓库操作信息
export const warehousePageActionInfo: Controller<void> = async (req, res, next) => {
  try {
    const { offset = 0, limit = 10 } = req.query
    const pageOffset = Number(offset)
    const pageLimit = Number(limit)
    const actionInfo = await warehousePageActionInfoModel(pageOffset, pageLimit)
    res.json({
      code: 200,
      message: '仓库操作信息获取成功',
      data: {
        actionInfo
      }
    })
  } catch (err) {
    next(err)
  }
}

// 新增仓库
export const addWarehouse: Controller<void> = async (req, res, next) => {
  try {
    const connection = await pool.getConnection()
    connection.beginTransaction()
    try {
      // 验证用户是否存在
      const token = getToken(req)
      const user_info = await userInfoModel(token, connection)
      if (!user_info) throw new Error('用户不存在')

      // 仓库名查重
      const { warehouse_name } = req.body
      const warehouse_name_isAdd = await warehouseNameCheckModel(warehouse_name, connection)
      if (warehouse_name_isAdd) {
        res.json({
          code: 4002,
          message: '仓库名已存在'
        })
        connection.rollback()
        return
      }

      // 新增仓库
      const warehouse_id = uuidv4()
      const { warehouse_type, warehouse_description } = req.body
      const warehouse_isAdd = await addWarehouseModel(warehouse_id, warehouse_name, user_info.user_id, warehouse_type, warehouse_description, connection)
      if (!warehouse_isAdd) throw new Error('仓库新增失败')

      // 新增操作信息
      const issue_id = uuidv4()
      const issue_isAdd = await addIssueInfoModel(issue_id, user_info.user_id, connection)
      if (!issue_isAdd) throw new Error('操作信息新增失败')

      // 新增仓库操作信息
      const warehouse_action_isAdd = await addWareActionInfoModel(issue_id, warehouse_id, 1, undefined, connection)
      if (!warehouse_action_isAdd) throw new Error('仓库操作信息新增失败')

      connection.commit()
    } catch (err) {
      connection.rollback()
      throw err
    } finally {
      connection.release()
    }
    res.json({
      code: 200,
      message: '仓库新增成功'
    })
  } catch (err) {
    next(err)
  }
}
