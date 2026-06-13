import express from 'express'
const router = express.Router()

import userRouter from './user.ts'
import warehouseRouter from './warehouse.ts'
import productRouter from './product.ts'
import todoRouter from './todo.ts'

import { checkToken } from '../middleware/checkToken.ts'
import { checkWarehouseUser } from '../middleware/checkWarehouseUser.ts'


// 用户路由
router.use('/user', userRouter)

// token鉴权
router.use(checkToken)

// 仓库路由
router.use('/warehouse', warehouseRouter)

// 产品路由
router.use('/product', productRouter)

// 待办事项路由
router.use('/todo', checkWarehouseUser, todoRouter)

export default router
