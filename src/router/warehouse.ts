import express from 'express'
const router = express.Router()

import { warehousePageInfo, warehousePageActionInfo, addWarehouse, editWarehouse, deleteWarehouse, warehouseInfo, editWarehouseDescription } from '../controller/warehouse.ts'
import { pageValidator } from '../validator/page.ts'
import { addWarehouseValidator, editWarehouseValidator, deleteWarehouseValidator, warehouseInfoValidator, warehouseActionInfoValidator, oneWarehouseInfoValidator, editWarehouseDescriptionValidator } from '../validator/warehouse.ts'


// 分页获取仓库信息
router.get('/', pageValidator, warehouseInfoValidator, warehousePageInfo)

// 分页获取仓库操作信息
router.get('/action', pageValidator, warehouseActionInfoValidator, warehousePageActionInfo)

// 获取仓库信息
router.get('/info', oneWarehouseInfoValidator, warehouseInfo)

// 新增仓库
router.post('/add', addWarehouseValidator, addWarehouse)

// 仓库编辑功能
router.patch('/edit', editWarehouseValidator, editWarehouse)

// 仓库描述编辑功能
router.patch('/editDescription', editWarehouseDescriptionValidator, editWarehouseDescription)

// 仓库删除功能
router.delete('/delete', deleteWarehouseValidator, deleteWarehouse)

export default router
