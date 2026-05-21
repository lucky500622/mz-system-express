export const errorHandler = (err, req, res, next) => {
  // 日志记录
  console.error('服务器错误详情:', err)

  // 基础错误信息处理
  const statusCode = err.statusCode || 500
  const message = err.message || '服务器内部错误'
  const errorCode = err.code || 'INTERNAL_ERROR'

  // 响应体结构
  const response = {
    code: statusCode,
    message: message,
    error: errorCode
  }

  // 开发环境额外返回错误栈
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack
  }

  // 发送响应
  res.status(statusCode).json(response)
}