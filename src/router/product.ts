import express from 'express'
const router = express.Router()

import { pageProductInfo, pageProductActionInfo } from '../controller/product.ts'
import { pageValidator } from '../validator/page.ts'

// 分页获取商品信息
router.get('/', pageValidator, pageProductInfo)

// 分页获取商品操作信息
router.get('/action', pageValidator, pageProductActionInfo)

export default router
