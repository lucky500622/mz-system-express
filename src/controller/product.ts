import { v4 as uuidv4 } from 'uuid'

import { Controller } from '../types/express.ts'

import pool from '../config/db.ts'
import { getToken } from '../utils/getToken.ts'
import { userInfoModel } from '../model/user.ts'
import { productPageInfoModel, productPageActionInfoModel, addProductModel, addProductActionInfoModel } from '../model/product.ts'
import { warehouseInfoModel } from '../model/warehouse.ts'
import { addIssueInfoModel } from '../model/issue.ts'

// 分页获取商品信息
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

// 分页获取商品操作信息
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

// 新增商品
export const addProduct: Controller<void> = async (req, res, next) => {
  try {
    const connection = await pool.getConnection()
    connection.beginTransaction()
    try {
      // 验证用户是否存在
      const token = getToken(req)
      const user_info = await userInfoModel(token, connection)
      if (!user_info) throw new Error('用户不存在')

      // 验证仓库是否存在
      const m_id = req.body.m_id
      const warehouseInfo = await warehouseInfoModel(m_id, connection)
      if (!warehouseInfo.length) {
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
      const product_isAdd = await addProductModel(product_id, warehouseInfo[0].warehouse_id, product_name, product_type, product_num, product_description, connection)
      if (!product_isAdd) throw new Error('商品新增失败')

      // 新增操作信息
      const issue_id = uuidv4()
      const issue_isAdd = await addIssueInfoModel(issue_id, user_info.user_id, connection)
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