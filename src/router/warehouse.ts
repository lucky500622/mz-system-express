import express from 'express'
const router = express.Router()

import { pageWarehouseInfo, pageWarehouseActionInfo, addWarehouse } from '../controller/warehouse.ts'
import { pageValidator } from '../validator/page.ts'

// 分页获取仓库信息
router.get('/', pageValidator, pageWarehouseInfo)

// 分页获取仓库操作信息
router.get('/action', pageValidator, pageWarehouseActionInfo)

// 新增仓库
router.post('/add', addWarehouse)

export default router
