import express from 'express'
const router = express.Router()

import { warehousePageInfo, warehousePageActionInfo, addWarehouse } from '../controller/warehouse.ts'
import { pageValidator } from '../validator/page.ts'
import { addWarehouseValidator } from '../validator/warehouse.ts'

// 分页获取仓库信息
router.get('/', pageValidator, warehousePageInfo)

// 分页获取仓库操作信息
router.get('/action', pageValidator, warehousePageActionInfo)

// 新增仓库
router.post('/add', addWarehouseValidator, addWarehouse)

export default router
