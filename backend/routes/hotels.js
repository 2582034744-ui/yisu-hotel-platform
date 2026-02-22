const express = require('express')
const router = express.Router()
const { hotels, bookings, users } = require('../data/mockData')

// 工具函数：生成订单号
const generateBookingId = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const random = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0')
    return `BK${year}${month}${day}${random}`
}

// 1. 获取酒店列表
router.get('/hotels', (req, res) => {
    try {
        const {
            page = 1,
            pageSize = 10,
            keyword = '',
            city = '',
            star_rating,
            min_price,
            max_price,
            sort_by,
            nearby_type,
        } = req.query

        // 过滤已上线的酒店（approved 或 published）
        let filteredHotels = hotels.filter(
            (hotel) => hotel.status === 'approved' || hotel.status === 'published',
        )

        // 关键词搜索（酒店名/地址）
        if (keyword) {
            const keywordLower = keyword.toLowerCase()
            filteredHotels = filteredHotels.filter(
                (hotel) =>
                    hotel.name.toLowerCase().includes(keywordLower) ||
                    hotel.address.toLowerCase().includes(keywordLower) ||
                    (hotel.name_en &&
                        hotel.name_en.toLowerCase().includes(keywordLower)),
            )
        }

        // 城市筛选
        if (city) {
            filteredHotels = filteredHotels.filter((hotel) =>
                hotel.city.includes(city),
            )
        }

        // 星级筛选
        if (star_rating) {
            filteredHotels = filteredHotels.filter(
                (hotel) => hotel.star_rating === parseInt(star_rating),
            )
        }

        // 价格筛选
        if (min_price || max_price) {
            filteredHotels = filteredHotels.filter((hotel) => {
                const minPrice = hotel.min_price
                if (min_price && max_price) {
                    return (
                        minPrice >= parseInt(min_price) &&
                        minPrice <= parseInt(max_price)
                    )
                } else if (min_price) {
                    return minPrice >= parseInt(min_price)
                } else if (max_price) {
                    return minPrice <= parseInt(max_price)
                }
                return true
            })
        }

        // 周边类型筛选
        if (nearby_type) {
            filteredHotels = filteredHotels.filter((hotel) => {
                if (!hotel.nearby_places || !Array.isArray(hotel.nearby_places)) {
                    return false
                }
                return hotel.nearby_places.some(
                    (place) => place.type === nearby_type
                )
            })
        }

        // 排序
        if (sort_by) {
            switch (sort_by) {
                case 'id':
                    filteredHotels.sort((a, b) => a.id - b.id)
                    break
                case 'price_asc':
                    filteredHotels.sort((a, b) => a.min_price - b.min_price)
                    break
                case 'price_desc':
                    filteredHotels.sort((a, b) => b.min_price - a.min_price)
                    break
                case 'rating':
                    filteredHotels.sort((a, b) => b.rating - a.rating)
                    break
                default:
                    break
            }
        }

        // 分页
        const startIndex = (parseInt(page) - 1) * parseInt(pageSize)
        const endIndex = startIndex + parseInt(pageSize)
        const paginatedHotels = filteredHotels.slice(startIndex, endIndex)

        // 格式化返回数据（移除不需要的字段）
        const formattedHotels = paginatedHotels.map((hotel) => ({
            id: hotel.id,
            name: hotel.name,
            name_en: hotel.name_en,
            address: hotel.address,
            star_rating: hotel.star_rating,
            images: hotel.images.slice(0, 2),
            min_price: hotel.min_price,
            rating: hotel.rating,
            review_count: hotel.review_count,
            distance: hotel.distance,
            facilities: hotel.facilities,
            description: hotel.description,
            phone: hotel.phone,
            email: hotel.email,
            nearby_places: hotel.nearby_places,
        }))

        res.json({
            data: formattedHotels,
            pagination: {
                total: filteredHotels.length,
                page: parseInt(page),
                pageSize: parseInt(pageSize),
                totalPages: Math.ceil(
                    filteredHotels.length / parseInt(pageSize),
                ),
            },
        })
    } catch (error) {
        res.status(500).json({
            message: '获取酒店列表失败',
            code: 500,
        })
    }
})

// 2. 获取推荐酒店（首页用）
router.get('/hotels/recommended', (req, res) => {
    try {
        const approvedHotels = hotels.filter((h) => h.status === 'approved' || h.status === 'published')
        const recommended = [...approvedHotels]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 6)
            .map((hotel) => ({
                id: hotel.id,
                name: hotel.name,
                name_en: hotel.name_en,
                address: hotel.address,
                star_rating: hotel.star_rating,
                images: hotel.images.slice(0, 1),
                min_price: hotel.min_price,
                rating: hotel.rating,
                review_count: hotel.review_count,
                distance: hotel.distance,
                facilities: hotel.facilities,
                description: hotel.description,
                phone: hotel.phone,
                email: hotel.email,
            }))

        res.json({
            data: recommended,
        })
    } catch (error) {
        res.status(500).json({
            message: '获取推荐酒店失败',
            code: 500,
        })
    }
})

// 3. 搜索酒店
router.get('/hotels/search', (req, res) => {
    try {
        const { keyword } = req.query

        if (!keyword) {
            return res.status(400).json({
                message: '请提供搜索关键词',
                code: 400,
            })
        }

        const keywordLower = keyword.toLowerCase()
        const approvedHotels = hotels.filter((h) => h.status === 'approved' || h.status === 'published')

        const searchResults = approvedHotels.filter(
            (hotel) =>
                hotel.name.toLowerCase().includes(keywordLower) ||
                hotel.address.toLowerCase().includes(keywordLower) ||
                hotel.city.toLowerCase().includes(keywordLower) ||
                (hotel.name_en &&
                    hotel.name_en.toLowerCase().includes(keywordLower)),
        )

        res.json({
            data: searchResults.map((hotel) => ({
                id: hotel.id,
                name: hotel.name,
                address: hotel.address,
                city: hotel.city,
                star_rating: hotel.star_rating,
                images: hotel.images.slice(0, 1),
                min_price: hotel.min_price,
                rating: hotel.rating,
            })),
        })
    } catch (error) {
        res.status(500).json({
            message: '搜索失败',
            code: 500,
        })
    }
})

// 4. 获取酒店详情
router.get('/hotels/:id', (req, res) => {
    try {
        const hotelId = parseInt(req.params.id)
        const hotel = hotels.find((h) => h.id === hotelId)

        if (!hotel) {
            return res.status(404).json({
                message: '酒店不存在',
                code: 404,
            })
        }

        // 只返回已上线的酒店
        if (hotel.status !== 'approved' && hotel.status !== 'published') {
            return res.status(404).json({
                message: '酒店已下线',
                code: 404,
            })
        }

        // 对房间按价格排序
        const sortedRooms = [...hotel.rooms].sort((a, b) => a.price - b.price)

        res.json({
            data: {
                ...hotel,
                rooms: sortedRooms,
            },
        })
    } catch (error) {
        res.status(500).json({
            message: '获取酒店详情失败',
            code: 500,
        })
    }
})

// 5. 创建预订
router.post('/bookings', (req, res) => {
    try {
        const { hotel_id, room_id, checkin_date, checkout_date, guest_info } =
            req.body

        // 验证必填字段
        if (
            !hotel_id ||
            !room_id ||
            !checkin_date ||
            !checkout_date ||
            !guest_info
        ) {
            return res.status(400).json({
                message: '请提供完整的预订信息',
                code: 400,
            })
        }

        // 验证酒店和房间是否存在
        const hotel = hotels.find((h) => h.id === parseInt(hotel_id))
        if (!hotel) {
            return res.status(404).json({
                message: '酒店不存在',
                code: 404,
            })
        }

        const room = hotel.rooms.find((r) => r.id === parseInt(room_id))
        if (!room) {
            return res.status(404).json({
                message: '房型不存在',
                code: 404,
            })
        }

        // 计算入住天数
        const checkin = new Date(checkin_date)
        const checkout = new Date(checkout_date)
        const days = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24))

        if (days <= 0) {
            return res.status(400).json({
                message: '入住日期无效',
                code: 400,
            })
        }

        // 计算总价（使用优惠价或原价）
        const price = room.discount_price || room.price
        const total_price = price * days

        // 生成预订ID
        const booking_id = generateBookingId()

        // 创建预订记录
        const newBooking = {
            booking_id,
            hotel_id: parseInt(hotel_id),
            hotel_name: hotel.name,
            room_id: parseInt(room_id),
            room_name: room.name,
            checkin_date,
            checkout_date,
            nights: days,
            guest_info,
            total_price,
            status: 'confirmed',
            created_at: new Date()
                .toISOString()
                .replace('T', ' ')
                .substring(0, 19),
        }

        // 保存到内存中的bookings数组
        bookings.push(newBooking)

        // 返回成功响应
        res.status(201).json({
            data: {
                booking_id,
                status: 'confirmed',
                total_price,
                created_at: newBooking.created_at,
            },
            message: '预订成功',
        })
    } catch (error) {
        console.error('创建预订失败:', error)
        res.status(500).json({
            message: '创建预订失败',
            code: 500,
        })
    }
})

// 6. 管理员获取所有酒店（包括所有状态）
router.get('/admin/hotels', (req, res) => {
    try {
        const {
            page = 1,
            pageSize = 10,
            keyword = '',
            city = '',
            status,
        } = req.query

        let filteredHotels = [...hotels]

        // 关键词搜索
        if (keyword) {
            const keywordLower = keyword.toLowerCase()
            filteredHotels = filteredHotels.filter(
                (hotel) =>
                    hotel.name.toLowerCase().includes(keywordLower) ||
                    hotel.address.toLowerCase().includes(keywordLower) ||
                    (hotel.name_en &&
                        hotel.name_en.toLowerCase().includes(keywordLower)),
            )
        }

        // 城市筛选
        if (city) {
            filteredHotels = filteredHotels.filter((hotel) =>
                hotel.city.includes(city),
            )
        }

        // 状态筛选
        if (status) {
            filteredHotels = filteredHotels.filter((hotel) =>
                hotel.status === status
            )
        }

        // 分页
        const startIndex = (parseInt(page) - 1) * parseInt(pageSize)
        const endIndex = startIndex + parseInt(pageSize)
        const paginatedHotels = filteredHotels.slice(startIndex, endIndex)

        // 格式化返回数据
        const formattedHotels = paginatedHotels.map((hotel) => {
            // 查找商户名称
            const merchant = users.find(u => u.id === hotel.merchant_id)
            const merchantName = merchant ? merchant.name : 
                (hotel.merchant_id === 1001 ? '上海外滩酒店管理有限公司' :
                hotel.merchant_id === 1002 ? '北京王府井酒店管理有限公司' : `商户${hotel.merchant_id}`)
            
            console.log(`DEBUG Hotel ${hotel.id}: status='${hotel.status}', merchant_id=${hotel.merchant_id}, merchantName='${merchantName}'`)
            
            return {
                id: hotel.id,
                name: hotel.name,
                merchantName: merchantName,
                city: hotel.city,
                stars: hotel.star_rating,
                price: hotel.min_price,
                status: hotel.status,
                createdAt: hotel.created_at,
            }
        })

        res.json({
            data: formattedHotels,
            pagination: {
                total: filteredHotels.length,
                page: parseInt(page),
                pageSize: parseInt(pageSize),
                totalPages: Math.ceil(
                    filteredHotels.length / parseInt(pageSize),
                ),
            },
            debug: {
                firstHotelRawStatus: paginatedHotels[0]?.status,
                firstHotelMerchantId: paginatedHotels[0]?.merchant_id,
                usersCount: users.length,
            }
        })
    } catch (error) {
        res.status(500).json({
            message: '获取酒店列表失败',
            code: 500,
        })
    }
})

// 7. 商户获取自己的酒店
router.get('/merchant/hotels', (req, res) => {
    try {
        const { merchantId } = req.query

        if (!merchantId) {
            return res.status(400).json({
                message: '请提供商户ID',
                code: 400,
            })
        }

        const merchantHotels = hotels.filter(
            (hotel) => hotel.merchant_id === parseInt(merchantId)
        )

        const formattedHotels = merchantHotels.map((hotel) => ({
            id: hotel.id,
            name: hotel.name,
            city: hotel.city,
            stars: hotel.star_rating,
            price: hotel.min_price,
            status: hotel.status,
            createdAt: hotel.created_at,
        }))

        res.json({
            data: formattedHotels,
        })
    } catch (error) {
        res.status(500).json({
            message: '获取酒店列表失败',
            code: 500,
        })
    }
})

// 8. 创建酒店
router.post('/hotels', (req, res) => {
    try {
        const hotelData = req.body

        // 验证必填字段
        if (!hotelData.name || !hotelData.address || !hotelData.city || !hotelData.star_rating) {
            return res.status(400).json({
                message: '请提供完整的酒店信息',
                code: 400,
            })
        }

        const newHotel = {
            id: hotels.length > 0 ? Math.max(...hotels.map(hotel => hotel.id)) + 1 : 1,
            ...hotelData,
            status: 'pending',
            created_at: new Date()
                .toISOString()
                .replace('T', ' ')
                .substring(0, 19),
            updated_at: new Date()
                .toISOString()
                .replace('T', ' ')
                .substring(0, 19),
        }

        hotels.push(newHotel)

        res.status(201).json({
            data: newHotel,
            message: '酒店创建成功，等待审核',
        })
    } catch (error) {
        res.status(500).json({
            message: '创建酒店失败',
            code: 500,
        })
    }
})

// 9. 更新酒店
router.put('/hotels/:id', (req, res) => {
    try {
        const hotelId = parseInt(req.params.id)
        const hotelIndex = hotels.findIndex((h) => h.id === hotelId)

        if (hotelIndex === -1) {
            return res.status(404).json({
                message: '酒店不存在',
                code: 404,
            })
        }

        const updatedHotel = {
            ...hotels[hotelIndex],
            ...req.body,
            id: hotelId,
            status: 'pending',
            updated_at: new Date()
                .toISOString()
                .replace('T', ' ')
                .substring(0, 19),
        }

        hotels[hotelIndex] = updatedHotel

        res.json({
            data: updatedHotel,
            message: '酒店更新成功，等待审核',
        })
    } catch (error) {
        res.status(500).json({
            message: '更新酒店失败',
            code: 500,
        })
    }
})

// 10. 删除酒店
router.delete('/hotels/:id', (req, res) => {
    try {
        const hotelId = parseInt(req.params.id)
        const hotelIndex = hotels.findIndex((h) => h.id === hotelId)

        if (hotelIndex === -1) {
            return res.status(404).json({
                message: '酒店不存在',
                code: 404,
            })
        }

        hotels.splice(hotelIndex, 1)

        res.json({
            message: '删除成功',
        })
    } catch (error) {
        res.status(500).json({
            message: '删除酒店失败',
            code: 500,
        })
    }
})

// 11. 审核酒店
router.put('/admin/hotels/:id/status', (req, res) => {
    try {
        const hotelId = parseInt(req.params.id)
        const { status } = req.body

        if (!status || !['published', 'rejected'].includes(status)) {
            return res.status(400).json({
                message: '无效的状态值',
                code: 400,
            })
        }

        const hotelIndex = hotels.findIndex((h) => h.id === hotelId)

        if (hotelIndex === -1) {
            return res.status(404).json({
                message: '酒店不存在',
                code: 404,
            })
        }

        hotels[hotelIndex].status = status
        hotels[hotelIndex].updated_at = new Date()
            .toISOString()
            .replace('T', ' ')
            .substring(0, 19)

        res.json({
            message: status === 'published' ? '审核通过' : '审核拒绝',
        })
    } catch (error) {
        res.status(500).json({
            message: '审核酒店失败',
            code: 500,
        })
    }
})

module.exports = router
