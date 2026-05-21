import { validationResult } from 'express-validator'

const validate = validations => {
  return async (req, res, next) => {
    // 校验请求体数据
    await Promise.all(validations.map(validation => validation.run(req)))

    // 校验通过，调用下一个中间件
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }

    // 校验失败，返回错误信息
    res.status(400).json({ errors: errors.array() })
  }
}

export default validate
