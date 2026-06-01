import express from 'express'
const router = express.Router()

import { pageWarehouseInfo } from '../controller/warehouse.ts'
import { pageValidator } from '../validator/page.ts'

// 分页获取仓库信息
router.get('/', pageValidator, pageWarehouseInfo)

export default router
