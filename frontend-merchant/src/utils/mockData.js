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

// 注册用户（调用后端API）
export const registerUser = async ({ username, password, name }) => {
  try {
    const res = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, name }),
    })
    const data = await res.json()
    if (!res.ok) {
      return { error: data.message || '注册失败' }
    }
    return { user: data.data }
  } catch (error) {
    return { error: '注册失败，请检查网络' }
  }
}
