import express from 'express'
const router = express.Router()

import { warehousePageInfo, warehousePageActionInfo, addWarehouse, editWarehouse, deleteWarehouse } from '../controller/warehouse.ts'
import { pageValidator } from '../validator/page.ts'
import { addWarehouseValidator, editWarehouseValidator, deleteWarehouseValidator, warehouseInfoValidator, warehouseActionInfoValidator } from '../validator/warehouse.ts'


// 分页获取仓库信息
router.get('/', pageValidator, warehouseInfoValidator, warehousePageInfo)

// 分页获取仓库操作信息
router.get('/action', pageValidator, warehouseActionInfoValidator, warehousePageActionInfo)

// 新增仓库
router.post('/add', addWarehouseValidator, addWarehouse)

// 仓库编辑功能
router.patch('/edit', editWarehouseValidator, editWarehouse)

// 仓库删除功能
router.delete('/delete', deleteWarehouseValidator, deleteWarehouse)

export default router
