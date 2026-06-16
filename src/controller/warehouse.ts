import { v4 as uuidv4 } from 'uuid'

import { Controller } from '../types/express.ts'
import pool from '../config/db.ts'

import { warehousePageInfoModel, addWarehouseModel, warehousePageActionInfoModel, addWareActionInfoModel, warehouseNameCheckModel, editWarehouseModel, warehouseInfoModel, deleteWarehouseModel, editWarehouseDescriptionModel, warehouseNameModel, handleWarehouseModel, addHandleWarehouseModel, exitHandleWarehouseModel, warehouseOverviewModel } from '../model/warehouse.ts'
import { deleteWarehouseProductModel, downListAllProductsModel } from '../model/product.ts'
import { deleteAllTodoModel } from '../model/todo.ts'
import { addIssueInfoModel } from '../model/issue.ts'
import { getApplyInfoModel } from '../model/apply.ts'

// 分页获取仓库信息
export const warehousePageInfo: Controller<void> = async (req, res, next) => {
  try {
    const { offset = 0, limit = 10, m_id, warehouse_name, warehouse_type, user_name } = req.query
    const pageOffset = Number(offset)
    const pageLimit = Number(limit)
    const warehouseInfo = await warehousePageInfoModel(pageOffset, pageLimit, Number(m_id), String(warehouse_name || ''), String(warehouse_type || ''), String(user_name || ''))
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
    const { offset = 0, limit = 10, m_id, warehouse_m_id, warehouse_name, action_type, user_name, start_time, end_time } = req.query
    const pageOffset = Number(offset)
    const pageLimit = Number(limit)
    const actionInfo = await warehousePageActionInfoModel(pageOffset, pageLimit, Number(m_id), Number(warehouse_m_id), String(warehouse_name || ''), Number(action_type), String(user_name || ''), String(start_time || ''), String(end_time || ''))
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

// 获取经手的仓库信息
export const handleWarehouse: Controller<void> = async (req, res, next) => {
  try {
    const handleWarehouseInfo = await handleWarehouseModel(res.locals.userInfo.user_id)
    res.json({
      code: 200,
      message: '经手的仓库信息获取成功',
      data: {
        handleWarehouseInfo
      }
    })
  } catch (err) {
    next(err)
  }
}

// 获取仓库信息
export const warehouseInfo: Controller<void> = async (req, res, next) => {
  try {
    const { m_id } = req.query
    const warehouseInfo = await warehouseInfoModel(Number(m_id))
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

// 新增仓库
export const addWarehouse: Controller<void> = async (req, res, next) => {
  try {
    const connection = await pool.getConnection()
    connection.beginTransaction()
    try {
      // 仓库名查重
      const { warehouse_name } = req.body
      const warehouse_name_isAdd = await warehouseNameCheckModel(warehouse_name, connection)
      if (warehouse_name_isAdd) {
        res.json({
          code: 4011,
          message: '仓库名已存在'
        })
        connection.rollback()
        return
      }

      // 新增仓库
      const warehouse_id = uuidv4()
      const { warehouse_type, warehouse_description } = req.body
      const description = warehouse_description ? `${warehouse_description} --- ${res.locals.userInfo.user_name}` : ''
      const warehouse_isAdd = await addWarehouseModel(warehouse_id, warehouse_name, res.locals.userInfo.user_id, warehouse_type, description, connection)
      if (!warehouse_isAdd) throw new Error('仓库新增失败')

      // 新增操作信息
      const issue_id = uuidv4()
      const issue_isAdd = await addIssueInfoModel(issue_id, res.locals.userInfo.user_id, connection)
      if (!issue_isAdd) throw new Error('操作信息新增失败')

      // 新增仓库操作信息
      const warehouse_action_isAdd = await addWareActionInfoModel(issue_id, warehouse_id, 1, warehouse_name, connection)
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

// 仓库编辑
export const editWarehouse: Controller<void> = async (req, res, next) => {
  try {
    const connection = await pool.getConnection()
    connection.beginTransaction()
    try {
      // 获取仓库信息
      const { m_id } = req.body
      const warehouseInfo = await warehouseInfoModel(m_id, connection)
      if (!warehouseInfo) throw new Error('仓库不存在')
      if (warehouseInfo.warehouse_name_ed) {
        res.json({
          code: 4012,
          message: '仓库名已被修改过'
        })
        connection.rollback()
        return
      }

      // 仓库名查重
      const { warehouse_name } = req.body
      const warehouse_name_isEdit = await warehouseNameCheckModel(warehouse_name, connection)
      if (warehouse_name_isEdit) {
        res.json({
          code: 4011,
          message: '仓库名已存在'
        })
        connection.rollback()
        return
      }

      // 仓库编辑
      const warehouse_isEdit = await editWarehouseModel(m_id, warehouseInfo.warehouse_name, warehouse_name, connection)
      if (!warehouse_isEdit) throw new Error('仓库编辑失败')

      // 新增操作信息
      const issue_id = uuidv4()
      const issue_isAdd = await addIssueInfoModel(issue_id, res.locals.userInfo.user_id, connection)
      if (!issue_isAdd) throw new Error('操作信息新增失败')

      // 新增仓库操作信息
      const warehouse_action_isAdd = await addWareActionInfoModel(issue_id, warehouseInfo.warehouse_id, 3, warehouse_name, connection)
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
      message: '仓库编辑成功'
    })

  } catch (err) {
    next(err)
  }
}

// 仓库描述编辑
export const editWarehouseDescription: Controller<void> = async (req, res, next) => {
  try {
    const connection = await pool.getConnection()
    connection.beginTransaction()
    try {
      // 获取仓库信息
      const { m_id } = req.body
      const warehouseInfo = await warehouseInfoModel(m_id, connection)
      if (!warehouseInfo) throw new Error('仓库不存在')

      // 仓库描述编辑
      const { description } = req.body
      const warehouse_description = `${description} --- ${res.locals.userInfo.user_name}`
      const warehouse_isEdit = await editWarehouseDescriptionModel(m_id, warehouse_description, connection)
      if (!warehouse_isEdit) throw new Error('仓库描述编辑失败')

      connection.commit()
    } catch (err) {
      connection.rollback()
      throw err
    } finally {
      connection.release()
    }

    res.json({
      code: 200,
      message: '仓库描述编辑成功'
    })
  } catch (err) {
    next(err)
  }
}

// 仓库删除
export const deleteWarehouse: Controller<void> = async (req, res, next) => {
  try {
    const connection = await pool.getConnection()
    connection.beginTransaction()
    try {
      // 获取仓库信息
      const m_id = Number(req.query.m_id)
      const warehouseInfo = await warehouseInfoModel(m_id, connection)
      if (!warehouseInfo) throw new Error('仓库不存在')
      if (warehouseInfo.exists_list_product) {
        res.json({
          code: 4013,
          message: '仓库下存在产品，不能删除'
        })
        connection.rollback()
        return
      }
      if (warehouseInfo.exists_user_handle) {
        res.json({
          code: 4014,
          message: '仓库已被经手，不能删除'
        })
        connection.rollback()
        return
      }

      // 删除仓库下的产品
      if (warehouseInfo.product_num) {
        const product_isDelete = await deleteWarehouseProductModel(warehouseInfo.warehouse_id, connection)
        if (!product_isDelete) throw new Error('仓库下产品删除失败')
      }

      // 删除仓库
      const warehouse_isDelete = await deleteWarehouseModel(m_id, connection)
      if (!warehouse_isDelete) throw new Error('仓库删除失败')

      // 新增操作信息
      const issue_id = uuidv4()
      const issue_isAdd = await addIssueInfoModel(issue_id, res.locals.userInfo.user_id, connection)
      if (!issue_isAdd) throw new Error('操作信息新增失败')

      // 新增仓库操作信息
      const warehouse_action_isAdd = await addWareActionInfoModel(issue_id, warehouseInfo.warehouse_id, 2, warehouseInfo.warehouse_name, connection)
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
      message: '仓库删除成功'
    })
  } catch (err) {
    next(err)
  }
}

// 仓库名获取
export const getWarehouseName: Controller<void> = async (req, res, next) => {
  try {
    // 获取仓库名
    const { text, limit = 10 } = req.query
    const warehouseName = await warehouseNameModel(String(text || ''), Number(limit))

    res.json({
      code: 200,
      message: '仓库名获取成功',
      data: {
        name: warehouseName
      }
    })
  } catch (err) {
    next(err)
  }
}

// 添加经手仓库
export const addHandleWarehouse: Controller<void> = async (req, res, next) => {
  try {
    const connection = await pool.getConnection()
    connection.beginTransaction()
    try {
      // 检查用户是否有申请
      const applyInfo = await getApplyInfoModel(res.locals.userInfo.user_id, connection)
      if (applyInfo) {
        res.json({
          code: 4016,
          message: '用户已存在申请，需先等待申请结果'
        })
        connection.rollback()
        return
      }

      // 获取仓库信息
      const { m_id } = req.body
      const warehouseInfo = await warehouseInfoModel(m_id, connection)
      if (!warehouseInfo) {
        res.json({
          code: 4015,
          message: '仓库不存在'
        })
        connection.rollback()
        return
      }
      if (warehouseInfo.exists_user_handle) {
        res.json({
          code: 4014,
          message: '仓库已被经手，不能添加'
        })
        connection.rollback()
        return
      }

      // 新增经手仓库
      const warehouse_user_id = res.locals.userInfo.user_id
      const warehouse_isAdd = await addHandleWarehouseModel(m_id, warehouse_user_id, connection)
      if (!warehouse_isAdd) throw new Error('仓库添加失败')

      // 新增操作信息
      const issue_id = uuidv4()
      const issue_isAdd = await addIssueInfoModel(issue_id, res.locals.userInfo.user_id, connection)
      if (!issue_isAdd) throw new Error('操作信息新增失败')

      // 新增仓库操作信息
      const warehouse_action_isAdd = await addWareActionInfoModel(issue_id, warehouseInfo.warehouse_id, 4, warehouseInfo.warehouse_name, connection)
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
      message: '经手仓库仓库添加成功'
    })
  } catch (err) {
    next(err)
  }
}

// 退出经手仓库
export const exitHandleWarehouse: Controller<void> = async (req, res, next) => {
  try {
    const connection = await pool.getConnection()
    connection.beginTransaction()
    try {
      // 下架所有产品
      const down_isAll = await downListAllProductsModel(Number(res.locals.warehouseInfo.m_id), connection)
      if (!down_isAll) throw new Error('仓库下产品下架失败')

      // 删除所有待办事项
      const todo_isDelete = await deleteAllTodoModel(Number(res.locals.warehouseInfo.m_id), connection)
      if (!todo_isDelete) throw new Error('仓库下待办事项删除失败')

      // 退出经手仓库
      const warehouse_isExit = await exitHandleWarehouseModel(Number(res.locals.warehouseInfo.m_id), connection)
      if (!warehouse_isExit) throw new Error('仓库退出失败')

      // 新增操作信息
      const issue_id = uuidv4()
      const issue_isAdd = await addIssueInfoModel(issue_id, res.locals.userInfo.user_id, connection)
      if (!issue_isAdd) throw new Error('操作信息新增失败')

      // 新增仓库操作信息
      const warehouse_action_isAdd = await addWareActionInfoModel(issue_id, res.locals.warehouseInfo.warehouse_id, 5, res.locals.warehouseInfo.warehouse_name, connection)
      if (!warehouse_action_isAdd) throw new Error('仓库操作信息新增失败')

      connection.commit()

      res.json({
        code: 200,
        message: '经手仓库删除成功'
      })
    } catch (err) {
      connection.rollback()
      throw err
    } finally {
      connection.release()
    }
  } catch (err) {
    next(err)
  }
}

// 获取仓库概览信息
export const getWarehouseOverview: Controller<void> = async (req, res, next) => {
  try {
    const warehouseOverview = await warehouseOverviewModel()
    res.json({
      code: 200,
      message: '仓库概览信息获取成功',
      data: {
        count: warehouseOverview.count,
        handle_count: warehouseOverview.handle_count
      }
    })
  } catch (err) {
    next(err)
  }
}