import express from 'express'
const router = express.Router()

import { checkToken } from '../middleware/checkToken.ts'
import { register, login, userInfo } from '../controller/user.ts'
import { registerValidator, loginValidator, checkUsernameValidator } from '../validator/user.ts'

// 用户注册
router.post('/register', registerValidator, register)

// 用户登录
router.post('/login', loginValidator, login)

// 用户信息获取
router.get('/info', checkToken, userInfo)

export default router
