import express from 'express'
const router = express.Router()

import userRouter from './user.js'

// 用户路由
router.use('/user', userRouter)

export default router
