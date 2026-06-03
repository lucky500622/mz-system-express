import { Controller } from '../types/express.ts'

import pool from '../config/db.ts'
import { getToken } from '../utils/getToken.ts'
import { userInfoModel } from '../model/user.ts'
import { productPageInfoModel, productPageActionInfoModel } from '../model/product.ts'
import { warehouseInfoModel } from '../model/warehouse.ts'

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
