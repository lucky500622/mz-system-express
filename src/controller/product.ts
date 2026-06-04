import { v4 as uuidv4 } from 'uuid'

import { Controller } from '../types/express.ts'

import pool from '../config/db.ts'
import { getToken } from '../utils/getToken.ts'
import { userInfoModel } from '../model/user.ts'
import { productPageInfoModel, productPageActionInfoModel, addProductModel, addProductActionInfoModel, productInfoModel, deleteProductModel } from '../model/product.ts'
import { warehouseInfoModel } from '../model/warehouse.ts'
import { addIssueInfoModel } from '../model/issue.ts'

// 分页获取产品信息
export const productPageInfo: Controller<void> = async (req, res, next) => {
  try {
    const { offset = 0, limit = 10 } = req.query
    const pageOffset = Number(offset)
    const pageLimit = Number(limit)
    const productInfo = await productPageInfoModel(pageOffset, pageLimit)
    res.json({
      code: 200,
      message: '商品信息获取成功',
      data: {
        productInfo
      }
    })
  } catch (err) {
    next(err)
  }
}

// 分页获取产品操作信息
export const productPageActionInfo: Controller<void> = async (req, res, next) => {
  try {
    const { offset = 0, limit = 10 } = req.query
    const pageOffset = Number(offset)
    const pageLimit = Number(limit)
    const actionInfo = await productPageActionInfoModel(pageOffset, pageLimit)
    res.json({
      code: 200,
      message: '商品操作信息获取成功',
      data: {
        actionInfo
      }
    })
  } catch (err) {
    next(err)
  }
}

// 新增产品
export const addProduct: Controller<void> = async (req, res, next) => {
  try {
    const connection = await pool.getConnection()
    connection.beginTransaction()
    try {
      // 验证仓库是否存在
      const m_id = req.body.m_id
      const warehouseInfo = await warehouseInfoModel(m_id, connection)
      if (!warehouseInfo) {
        res.json({
          code: 4003,
          message: '仓库不存在'
        })
        connection.rollback()
        return
      }

      // 新增商品
      const { product_name, product_type, product_num, product_description } = req.body
      const product_id = uuidv4()
      const product_isAdd = await addProductModel(product_id, warehouseInfo.warehouse_id, product_name, product_type, product_num, product_description, connection)
      if (!product_isAdd) throw new Error('商品新增失败')

      // 新增操作信息
      const issue_id = uuidv4()
      const issue_isAdd = await addIssueInfoModel(issue_id, res.locals.userInfo.user_id, connection)
      if (!issue_isAdd) throw new Error('操作信息新增失败')

      // 新增商品操作信息
      const product_action_isAdd = await addProductActionInfoModel(issue_id, product_id, 1, product_num, connection)
      if (!product_action_isAdd) throw new Error('商品操作信息新增失败')

      connection.commit()
    } catch (err) {
      connection.rollback()
      throw err
    } finally {
      connection.release()
    }
    res.json({
      code: 200,
      message: '商品新增成功'
    })
  } catch (err) {
    next(err)
  }
}

// 删除产品
export const deleteProduct: Controller<void> = async (req, res, next) => {
  try {
    const connection = await pool.getConnection()
    connection.beginTransaction()
    try {
      // 验证产品是否存在
      const m_id = req.body.m_id
      const productInfo = await productInfoModel(m_id, connection)
      if (!productInfo) throw new Error('产品不存在')

      // 删除产品
      const product_isDelete = await deleteProductModel(m_id, connection)
      if (!product_isDelete) throw new Error('产品删除失败')

      // 新增操作信息
      const issue_id = uuidv4()
      const issue_isAdd = await addIssueInfoModel(issue_id, res.locals.userInfo.user_id, connection)
      if (!issue_isAdd) throw new Error('操作信息新增失败')

      // 新增商品操作信息
      const product_action_isAdd = await addProductActionInfoModel(issue_id, productInfo.product_id, 2, productInfo.product_num, connection)
      if (!product_action_isAdd) throw new Error('商品操作信息新增失败')

      connection.commit()
    } catch (err) {
      connection.rollback()
      throw err
    } finally {
      connection.release()
    }
    res.json({
      code: 200,
      message: '产品删除成功'
    })
  } catch (err) {
    next(err)
  }
}