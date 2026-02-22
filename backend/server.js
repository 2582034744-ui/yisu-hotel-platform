const express = require('express')
const cors = require('cors')
const path = require('path')
const hotelRoutes = require('./routes/hotels')
const authRoutes = require('./routes/auth')

const app = express()
const PORT = 3001

// 中间件配置
app.use(cors()) // 允许跨域请求
app.use(express.json()) // 解析JSON请求体
app.use(express.urlencoded({ extended: true })) // 解析URL编码的请求体
app.use(express.static(path.join(__dirname, 'public'))) // 提供静态文件服务

// 路由配置
app.use('/api', hotelRoutes)
app.use('/api', authRoutes)

// 根路径测试接口
app.get('/', (req, res) => {
    res.json({
        message: '酒店预订平台API服务器',
        version: '1.0',
        endpoints: [
            'GET /api/hotels',
            'GET /api/hotels/:id',
            'GET /api/hotels/recommended',
            'GET /api/hotels/search',
            'POST /api/bookings',
            'POST /api/auth/login',
            'POST /api/auth/register',
            'GET /api/admin/hotels',
            'GET /api/merchant/hotels',
            'POST /api/hotels',
            'PUT /api/hotels/:id',
            'DELETE /api/hotels/:id',
            'PUT /api/admin/hotels/:id/status',
        ],
    })
})

// DEBUG 端点
const { hotels } = require('./data/mockData')
app.get('/debug/hotels', (req, res) => {
    res.json({
        total: hotels.length,
        firstHotel: hotels[0] ? { id: hotels[0].id, name: hotels[0].name, status: hotels[0].status } : null,
        allStatuses: hotels.map(h => ({ id: h.id, status: h.status }))
    })
})

// 404处理
app.use((req, res) => {
    res.status(404).json({
        message: '接口不存在',
        code: 404,
    })
})

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
        message: '服务器内部错误',
        code: 500,
    })
})

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`)
    console.log(`接口基础路径: http://localhost:${PORT}/api`)
})
