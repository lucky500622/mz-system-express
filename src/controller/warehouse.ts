import { Controller } from '../types/express.ts'

import { warehouseInfoModel } from '../model/warehouse.ts'

// 分页获取仓库信息
export const pageWarehouseInfo: Controller<void> = async (req, res, next) => {
  try {
    const { offset = 0, limit = 10 } = req.query
    const pageOffset = Number(offset)
    const pageLimit = Number(limit)
    const warehouseInfo = await warehouseInfoModel(pageOffset, pageLimit)
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
