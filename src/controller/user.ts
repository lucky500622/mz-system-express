import { v4 as uuidv4 } from 'uuid'
import md5 from '../utils/md5.ts'

import { Controller } from '../types/express.ts'

import { registerModel, queryUserNameModel, loginCheckModel, createTokenModel } from '../model/user.ts'

// 用户注册
export const register: Controller<void> = async (req, res, next) => {
  try {
    const { user_name, user_password } = req.body
    const id = uuidv4()
    const role = 'staff'
    const encryptedPassword = md5(user_password)
    await registerModel(id, user_name, encryptedPassword, role)

    res.json({
      code: 200,
      message: '用户注册成功',
      data: {
        user_name,
      }
    })
  } catch (err) {
    next(err)
  }
}

// 用户名查重
export const checkUsername: Controller<void> = async (req, res, next) => {
  try {
    const { user_name } = req.query
    const result = await queryUserNameModel(user_name as string)

    res.json({
      code: 200,
      message: '用户名查重成功',
      data: {
        user_name,
        isExist: result,
      }
    })
  } catch (err) {
    next(err)
  }
}

// 用户登录
export const login: Controller<void> = async (req, res, next) => {
  try {
    const { user_name, user_password } = req.body
    const encryptedPassword = md5(user_password)
    const user_id = await loginCheckModel(user_name, encryptedPassword)
    if (user_id) {
      // 生成随机token与过期时间
      const token = uuidv4()
      const expireData = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
      await createTokenModel(token, user_id, expireData)
      res.json({
        code: 200,
        message: '用户登录成功',
        data: {
          user_name,
          token,
        }
      })
    } else {
      res.json({
        code: 4001,
        message: '用户登录失败，用户名或密码错误',
      })
    }
  } catch (err) {
    next(err)
  }
}