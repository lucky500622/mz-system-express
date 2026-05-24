import express from 'express'
const router = express.Router()

import { register, checkUsername, login } from '../controller/user.js'
import { registerValidator, loginValidator } from '../validator/user.js'

// 用户注册
router.post('/register', registerValidator, register)

// 用户名查重
router.get('/register/checkUsername', checkUsername)

// 用户登录
router.post('/login', loginValidator, login)

export default router
