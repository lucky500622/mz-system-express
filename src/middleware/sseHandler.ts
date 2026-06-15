import type { Request, Response } from 'express'

import { userRoleModelByUserName } from '../model/user.ts'

// 定义SSE发送函数类型
type SseSendFn = (data: unknown) => void
// 存储所有客户端SSE发送函数
const clients = new Map<string, (data: any) => void>()

export async function sseHandler(req: Request, res: Response) {
  // 用户名作为唯一标识，作为token的替代方案
  const { user_name } = req.query
  if (!user_name) {
    return res.status(401).end('缺少用户标识')
  }
  const { user_role } = await userRoleModelByUserName(String(user_name))
  if (!user_role) {
    return res.status(401).end('用户不存在')
  }

  // 设置SSE标准响应头
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  // 心跳保活
  const heartbeatTimer = setInterval(() => {
    try {
      res.write('data: ping\n\n')
    } catch (err) {
      console.error('SSE 心跳发送失败', err)
    }
  }, 10000)

  // send方法，用于发送SSE消息封装
  const send: SseSendFn = (data) => {
    try {
      const payload = JSON.stringify(data)
      res.write(`data: ${payload}\n\n`)
    } catch (err) {
      console.error('SSE 消息写入失败', err)
    }
  }
  // 存储当前客户端发送函数
  clients.set(`${user_name}-${user_role}`, send)

  // 断开连接时清理资源
  req.on('close', () => {
    clearInterval(heartbeatTimer)
    clients.delete(`${user_name}-${user_role}`)
  })

  // 初始化连接成功消息
  send({ msg: '连接成功' })
}

// 全员广播
export function broadcastMessage() {
  const msg = {
    time: new Date().toLocaleTimeString(),
    content: '消息'
  }
  // 遍历所有客户端发送函数
  for (const send of clients.values()) {
    send(msg)
  }
}

// 定向广播
export function sendToUser(connection?: string) {
  const msg = {
    time: new Date().toLocaleTimeString(),
    content: connection || '消息'
  }
  for (const [key, send] of clients) {
    // 匹配角色为sup_admin的用户
    if (key.includes('sup_admin')) {
      send(msg)
    }
  }
}