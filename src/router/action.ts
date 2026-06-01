import express from 'express'
const router = express.Router()

import { pageWarehouseActionInfo, pageProductActionInfo } from '../controller/action.ts'
import { pageValidator } from '../validator/page.ts'

// 分页获取仓库操作信息
router.get('/warehouse', pageValidator, pageWarehouseActionInfo)

// 分页获取商品操作信息
router.get('/product', pageValidator, pageProductActionInfo)

export default router
