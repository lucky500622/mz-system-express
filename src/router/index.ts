import express from 'express'
const router = express.Router()

import userRouter from './user.ts'
import warehouseRouter from './warehouse.ts'
import productRouter from './product.ts'
import actionRouter from './action.ts'

import { checkToken } from '../middleware/checkToken.ts'

// 用户路由
router.use('/user', userRouter)

// token鉴权
router.use(checkToken)

// 仓库路由
router.use('/warehouse', warehouseRouter)

// 商品路由
router.use('/product', productRouter)

// 操作路由
router.use('/action', actionRouter)

export default router
