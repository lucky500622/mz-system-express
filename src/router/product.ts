import express from 'express'
const router = express.Router()

import { productPageInfo, productPageActionInfo, addProduct, deleteProduct, adjustProductNum } from '../controller/product.ts'
import { pageValidator } from '../validator/page.ts'
import { addProductValidator, deleteProductValidator, adjustProductNumValidator } from '../validator/product.ts'

// 分页获取产品信息
router.get('/', pageValidator, productPageInfo)

// 分页获取产品操作信息
router.get('/action', pageValidator, productPageActionInfo)

// 新增产品
router.post('/add', addProductValidator, addProduct)

// 删除产品
router.post('/delete', deleteProductValidator, deleteProduct)

// 调整产品数量
router.post('/update', adjustProductNumValidator, adjustProductNum)

export default router
