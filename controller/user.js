import { registerModel, queryUserNameModel, loginModel } from '../model/user.js'

// 用户注册
export const register = async (req, res, next) => {
  try {
    const { user_name, user_password } = req.body
    await registerModel(user_name, user_password)

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
export const checkUsername = async (req, res, next) => {
  try {
    const { user_name } = req.query
    const result = await queryUserNameModel(user_name)

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
export const login = async (req, res, next) => {
  try {
    const { user_name, user_password } = req.body
    const result = await loginModel(user_name, user_password)
    if (result) {
      res.json({
        code: 200,
        message: '用户登录成功',
        data: {
          user_name,
          token: result
        }
      })
    } else {
      res.json({
        code: 4001,
        message: '用户名或密码错误'
      })
    }
  } catch (err) {
    next(err)
  }
}