import express from 'express'
const router = express.Router()

import { productPageInfo, productPageActionInfo, addProduct, deleteProduct, adjustProductNum, editProductDescription, getProductName, getWarehouseProduct, listProduct, saleProduct } from '../controller/product.ts'
import { pageValidator } from '../validator/page.ts'
import { addProductValidator, deleteProductValidator, adjustProductNumValidator, productInfoValidator, productActionInfoValidator, editProductDescriptionValidator, productNameValidator, listProductValidator, saleProductValidator } from '../validator/product.ts'
import { checkWarehouseUser } from '../middleware/checkWarehouseUser.ts'

// 分页获取产品信息
router.get('/', pageValidator, productInfoValidator, productPageInfo)

// 分页获取产品操作信息
router.get('/action', pageValidator, productActionInfoValidator, productPageActionInfo)

// 新增产品
router.post('/add', addProductValidator, addProduct)

// 删除产品
router.patch('/delete', deleteProductValidator, deleteProduct)

// 调整产品数量
router.patch('/update', adjustProductNumValidator, adjustProductNum)

// 编辑产品描述
router.patch('/editDescription', editProductDescriptionValidator, editProductDescription)

// 获取产品名称
router.get('/name', productNameValidator, getProductName)

// 获取仓库产品信息
router.get('/infoOfWarehouse', checkWarehouseUser, getWarehouseProduct)

// 上下架产品
router.patch('/list/update', checkWarehouseUser, listProductValidator, listProduct)

// 售出产品
router.patch('/sale', checkWarehouseUser, saleProductValidator, saleProduct)

export default router
