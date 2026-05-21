import { registerModel } from '../model/user.js'

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
