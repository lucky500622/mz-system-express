import { Controller } from '../types/express.ts'

import { warehouseHandleUserIdModel } from '../model/warehouse.ts'

export const checkWarehouseUser: Controller<void> = async (req, res, next) => {
  try {
    const { m_id } = req.query
    // 获取仓库经手者ID
    const warehouseInfo = await warehouseHandleUserIdModel(Number(m_id))
    if (warehouseInfo.warehouse_user_id !== res.locals.userInfo.user_id) throw new Error('仓库经手者不是当前用户')

    // 挂载仓库ID
    res.locals.warehouseId = warehouseInfo.warehouse_id

    next()
  } catch (error) {
    next(error)
  }
}