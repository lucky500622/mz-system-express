import { Controller } from '../types/express.ts'

import { actionInfoModel, productActionInfoModel } from '../model/action.ts'

// 分页获取仓库操作信息
export const pageWarehouseActionInfo: Controller<void> = async (req, res, next) => {
  try {
    const { offset = 0, limit = 10 } = req.query
    const pageOffset = Number(offset)
    const pageLimit = Number(limit)
    const actionInfo = await actionInfoModel(pageOffset, pageLimit)
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

// 分页获取商品操作信息
export const pageProductActionInfo: Controller<void> = async (req, res, next) => {
  try {
    const { offset = 0, limit = 10 } = req.query
    const pageOffset = Number(offset)
    const pageLimit = Number(limit)
    const actionInfo = await productActionInfoModel(pageOffset, pageLimit)
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