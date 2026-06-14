import express from 'express'
const router = express.Router()

import { checkToken } from '../middleware/checkToken.ts'
import { register, login, userInfo, updatePassword, logout, userList } from '../controller/user.ts'
import { registerValidator, loginValidator, updatePasswordValidator } from '../validator/user.ts'

// 用户注册
router.post('/register', registerValidator, register)

// 用户登录
router.post('/login', loginValidator, login)

// 用户信息获取
router.get('/info', checkToken, userInfo)

// 用户密码修改
router.post('/update', checkToken, updatePasswordValidator, updatePassword)

// 用户退出
router.post('/logout', checkToken, logout)

// 获取用户列表
router.get('/list', userList)

export default router
