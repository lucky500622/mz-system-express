import { Controller } from '../types/express.ts'

import { warehouseHandleUserIdModel } from '../model/warehouse.ts'

export const checkWarehouseUser: Controller<void> = async (req, res, next) => {
  try {
    const { warehouse_m_id } = req.query
    if (!warehouse_m_id) throw new Error('仓库序列号不能为空')

    // 获取仓库经手者ID
    const warehouseInfo = await warehouseHandleUserIdModel(Number(warehouse_m_id))
    if (warehouseInfo.warehouse_user_id !== res.locals.userInfo.user_id) throw new Error('仓库经手者不是当前用户')

    // 挂载仓库信息
    res.locals.warehouseInfo = {
      warehouse_id: warehouseInfo.warehouse_id,
      m_id: warehouse_m_id,
    }

    next()
  } catch (error) {
    next(error)
  }
}