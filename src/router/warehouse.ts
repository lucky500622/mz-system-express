import express from 'express'
const router = express.Router()

import { pageWarehouseInfo } from '../controller/warehouse.ts'

// 分页获取仓库信息
router.get('/', pageWarehouseInfo)

export default router
