import { Form, Input, InputNumber, Select, Checkbox, Button, Card, message, Rate } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useState, useEffect } from 'react'
import { getHotels } from '../../utils/mockData'

const { TextArea } = Input
const FACILITIES = ['WiFi', '停车场', '游泳池', '健身房', '餐厅', '会议室', 'SPA', '商务中心']
const CITIES = ['北京', '上海', '广州', '深圳', '杭州', '成都', '西安', '武汉', '厦门', '桂林', '丽江']

// 城市坐标映射
const cityCoords = {
  '北京': { lat: 39.9042, lng: 116.4074 },
  '上海': { lat: 31.2304, lng: 121.4737 },
  '广州': { lat: 23.1291, lng: 113.2644 },
  '深圳': { lat: 22.5431, lng: 114.0579 },
  '杭州': { lat: 30.2741, lng: 120.1551 },
  '成都': { lat: 30.5728, lng: 104.0668 },
  '西安': { lat: 34.3416, lng: 108.9398 },
  '武汉': { lat: 30.5928, lng: 114.3055 },
  '厦门': { lat: 24.4798, lng: 118.0894 },
  '桂林': { lat: 25.2740, lng: 110.2993 },
  '丽江': { lat: 26.8721, lng: 100.2295 },
}

export default function HotelForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const isEdit = !!id

  // 加载酒店数据
  useEffect(() => {
    if (isEdit) {
      const loadHotel = async () => {
        setLoading(true)
        const data = await getHotels()
        const hotel = data.find(h => h.id === Number(id))
        if (hotel) {
          form.setFieldsValue(hotel)
        }
        setLoading(false)
      }
      loadHotel()
    }
  }, [id, isEdit, form])

  const onFinish = async (values) => {
    try {
      setLoading(true)
      
      // 获取城市坐标
      const coords = cityCoords[values.city] || { lat: 31.2304, lng: 121.4737 }
      
      // 构建酒店数据
      const hotelData = {
        name: values.name,
        name_en: '',
        address: values.address,
        city: values.city,
        star_rating: values.stars,
        description: values.description || '',
        facilities: Array.isArray(values.facilities) ? values.facilities.join('、') : values.facilities || '',
        phone: values.phone,
        email: '',
        images: [],
        min_price: values.price,
        rating: 4.5,
        review_count: 0,
        distance: '',
        latitude: coords.lat,
        longitude: coords.lng,
        merchant_id: user.id, // 使用用户ID作为商户ID
        status: 'pending',
        rooms: [
          {
            id: Date.now(),
            name: '标准间',
            price: values.price,
            discount_price: Math.floor(values.price * 0.9),
            bed_type: '大床/双床',
            area: 25,
            max_guests: 2,
            description: '舒适标准间',
            images: [],
          }
        ],
        nearby_places: [],
      }

      const url = isEdit 
        ? `http://localhost:3001/api/hotels/${id}`
        : 'http://localhost:3001/api/hotels'
      
      const method = isEdit ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hotelData),
      })

      const result = await res.json()
      
      if (res.ok) {
        message.success(isEdit ? '修改成功，等待审核' : '提交成功，等待审核')
        navigate('/merchant/hotels')
      } else {
        message.error(result.message || '操作失败')
      }
    } catch (error) {
      console.error('保存失败:', error)
      message.error('保存失败，请检查网络')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title={isEdit ? '编辑酒店' : '新增酒店'} style={{ borderRadius: 12, maxWidth: 800 }} loading={loading}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="name" label="酒店名称" rules={[{ required: true }]}>
          <Input placeholder="请输入酒店名称" />
        </Form.Item>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item name="city" label="城市" rules={[{ required: true }]}>
            <Select placeholder="选择城市" options={CITIES.map(c => ({ value: c, label: c }))} />
          </Form.Item>
          <Form.Item name="stars" label="星级" rules={[{ required: true }]}>
            <Select placeholder="选择星级" options={[1,2,3,4,5].map(v => ({ value: v, label: '⭐'.repeat(v) }))} />
          </Form.Item>
        </div>
        <Form.Item name="address" label="详细地址" rules={[{ required: true }]}>
          <Input placeholder="请输入详细地址" />
        </Form.Item>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item name="price" label="价格（元/晚）" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入价格" />
          </Form.Item>
          <Form.Item name="phone" label="联系电话" rules={[{ required: true }]}>
            <Input placeholder="请输入联系电话" />
          </Form.Item>
        </div>
        <Form.Item name="facilities" label="设施服务">
          <Checkbox.Group options={FACILITIES} />
        </Form.Item>
        <Form.Item name="description" label="酒店描述">
          <TextArea rows={4} placeholder="请输入酒店描述" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            {isEdit ? '保存修改' : '提交审核'}
          </Button>
          <Button onClick={() => navigate('/merchant/hotels')}>取消</Button>
        </Form.Item>
      </Form>
    </Card>
  )
}
