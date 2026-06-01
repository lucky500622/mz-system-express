import express from 'express'
const router = express.Router()

import { pageProductInfo } from '../controller/product.ts'
import { pageValidator } from '../validator/page.ts'

// 分页获取商品信息
router.get('/', pageValidator, pageProductInfo)

export default router
