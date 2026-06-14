import { v4 as uuidv4 } from 'uuid'
import md5 from '../utils/md5.ts'

import { Controller } from '../types/express.ts'

import pool from '../config/db.ts'
import { getToken } from '../utils/getToken.ts'
import { registerModel, queryUserNameModel, loginCheckModel, createTokenModel, userInfoModel, updatePasswordModel, logoutModel, userListModel } from '../model/user.ts'

// 用户注册
export const register: Controller<void> = async (req, res, next) => {
  try {
    const { user_name, user_password } = req.body
    // 校验用户名是否存在
    const isExist = await queryUserNameModel(user_name)
    if (isExist) {
      res.json({
        code: 4002,
        message: '用户名已存在'
      })
      return
    }
    // 注册用户
    const id = uuidv4()
    const role = 'staff'
    const encryptedPassword = md5(user_password)
    await registerModel(id, user_name, encryptedPassword, role)

    res.json({
      code: 200,
      message: '用户注册成功',
      data: {
        isExist: false,
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

// 用户信息获取
export const userInfo: Controller<void> = async (req, res, next) => {
  try {
    const token = getToken(req)
    const userInfo = await userInfoModel(token)
    res.json({
      code: 200,
      message: '用户信息获取成功',
      data: {
        user_name: userInfo.user_name,
        user_role: userInfo.user_role,
      }
    })
  } catch (err) {
    next(err)
  }
}

// 用户密码修改
export const updatePassword: Controller<void> = async (req, res, next) => {
  try {
    const connection = await pool.getConnection()
    connection.beginTransaction()
    try {
      const { oldPassword, newPassword } = req.body
      const encryptedPassword = md5(oldPassword)
      const user_id = await loginCheckModel(res.locals.userInfo.user_name, encryptedPassword)
      if (!user_id) {
        res.json({
          code: 4001,
          message: '用户密码修改失败，旧密码错误',
        })
        connection.rollback()
        return
      }

      const isUpdate = await updatePasswordModel(user_id, md5(newPassword), connection)
      if (!isUpdate) throw new Error('用户密码修改失败')

      connection.commit()
    } catch (err) {
      connection.rollback()
      next(err)
    } finally {
      connection.release()
    }

    res.json({
      code: 200,
      message: '用户密码修改成功',
    })
  } catch (err) {
    next(err)
  }
}

// 用户退出
export const logout: Controller<void> = async (req, res, next) => {
  try {
    const token = getToken(req)
    await logoutModel(token)

    res.json({
      code: 200,
      message: '用户退出成功',
    })
  } catch (err) {
    next(err)
  }
}

// 获取用户列表
export const userList: Controller<void> = async (req, res, next) => {
  try {
    const userList = await userListModel()
    res.json({
      code: 200,
      message: '用户列表获取成功',
      data: {
        userList,
      }
    })
  } catch (err) {
    next(err)
  }
}