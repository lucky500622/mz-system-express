import express from 'express'
const router = express.Router()

import { pageProductInfo } from '../controller/product.ts'

// 分页获取商品信息
router.get('/', pageProductInfo)

export default router
