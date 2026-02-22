// Mock users
export const MOCK_USERS = [
  { id: 1, username: 'admin', password: '123456', role: 'admin', name: '超级管理员' },
  { id: 2, username: 'merchant1', password: '123456', role: 'merchant', name: '商户A', merchantId: 'M001' },
  { id: 3, username: 'merchant2', password: '123456', role: 'merchant', name: '商户B', merchantId: 'M002' },
]

// 从后端 API 获取所有酒店数据（admin用）
export const getHotels = async (status = '') => {
  try {
    const url = status 
      ? `http://localhost:3001/api/admin/hotels?page=1&pageSize=50&status=${status}`
      : 'http://localhost:3001/api/admin/hotels?page=1&pageSize=50'
    const res = await fetch(url)
    const data = await res.json()
    // 转换后端数据格式
    const hotels = (data.data || []).map(h => ({
      id: h.id,
      name: h.name,
      merchantId: h.merchantId || `M${h.merchant_id}`,
      merchantName: h.merchantName || `商户${h.merchant_id}`,
      address: h.address,
      city: h.city,
      stars: h.stars || h.star_rating,
      price: h.price || h.min_price || 0,
      phone: h.phone,
      description: h.description,
      facilities: Array.isArray(h.facilities) ? h.facilities : (h.facilities?.split('、') || []),
      images: Array.isArray(h.images) ? h.images : [],
      status: h.status,
      createdAt: h.createdAt || h.created_at?.split(' ')[0],
    }))
    return hotels
  } catch (error) {
    console.error('获取酒店失败:', error)
    return []
  }
}

export const saveHotels = (hotels) => {
  localStorage.setItem('hms_hotels', JSON.stringify(hotels))
}

export const getUsers = () => {
  const saved = localStorage.getItem('hms_users')
  return saved ? JSON.parse(saved) : MOCK_USERS
}

export const registerUser = ({ username, password, name }) => {
  const users = getUsers()
  if (users.find(u => u.username === username)) return { error: '用户名已存在' }
  const newUser = {
    id: Date.now(), username, password, role: 'merchant', name,
    merchantId: 'M' + Date.now()
  }
  localStorage.setItem('hms_users', JSON.stringify([...users, newUser]))
  return { user: newUser }
}
