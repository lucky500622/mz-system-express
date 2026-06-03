import express from 'express'
const router = express.Router()

import { productPageInfo, productPageActionInfo, addProduct } from '../controller/product.ts'
import { pageValidator } from '../validator/page.ts'
import { addProductValidator } from '../validator/product.ts'

// 分页获取商品信息
router.get('/', pageValidator, productPageInfo)

// 分页获取商品操作信息
router.get('/action', pageValidator, productPageActionInfo)

// 新增商品
router.post('/add', addProductValidator, addProduct)

export default router
