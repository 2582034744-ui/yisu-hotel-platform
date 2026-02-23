import request from './request'
import type { Hotel, SearchParams, ApiResponse, Pagination } from '../types'

// 获取酒店列表
export const getHotelList = (
    params: SearchParams,
): Promise<ApiResponse<Hotel[]>> => {
    return request.get('/hotels', { params })
}

// 获取酒店详情
export const getHotelDetail = (id: number): Promise<ApiResponse<Hotel>> => {
    return request.get(`/hotels/${id}`)
}

// 搜索酒店
export const searchHotels = (
    keyword: string,
): Promise<ApiResponse<Hotel[]>> => {
    return request.get('/hotels/search', { params: { keyword } })
}

// 获取推荐酒店
export const getRecommendedHotels = (): Promise<ApiResponse<Hotel[]>> => {
    return request.get('/hotels/recommended')
}

// 创建预订（可选）
export const createBooking = (data: {
    hotel_id: number
    room_id: number
    checkin_date: string
    checkout_date: string
    guest_info: {
        name: string
        phone: string
    }
}) => {
    return request.post('/bookings', data)
}
