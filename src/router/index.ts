import express from 'express'
const router = express.Router()

import userRouter from './user.ts'
import warehouseRouter from './warehouse.ts'

import { checkToken } from '../middleware/checkToken.ts'

// 用户路由
router.use('/user', userRouter)

// token鉴权
router.use(checkToken)

// 仓库路由
router.use('/warehouse', warehouseRouter)

export default router
