import express from 'express'
const router = express.Router()

import { productPageInfo, productPageActionInfo } from '../controller/product.ts'
import { pageValidator } from '../validator/page.ts'

// 分页获取商品信息
router.get('/', pageValidator, productPageInfo)

// 分页获取商品操作信息
router.get('/action', pageValidator, productPageActionInfo)

export default router
