import { Form, Input, InputNumber, Select, Checkbox, Button, Card, message, Space, Divider, Upload, Tag } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useState, useEffect } from 'react'
import { getHotels } from '../../utils/mockData'
import { PlusOutlined, DeleteOutlined, EnvironmentOutlined } from '@ant-design/icons'

// 默认酒店图片
const DEFAULT_HOTEL_IMAGE = 'https://via.placeholder.com/400x300?text=Hotel'

const { TextArea } = Input
const FACILITIES = ['WiFi', '早餐', '停车场', '游泳池', '健身房', '餐厅', '会议室', 'SPA', '商务中心', '空调', '热水', '电视']
const CITIES = ['北京', '上海', '广州', '深圳', '杭州', '成都', '西安', '武汉', '厦门', '桂林', '丽江']
const BED_TYPES = ['大床1.5m', '大床1.8m', '大床2m', '双床1.2m', '双床1.5m', '单人床1.2m']

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
  const [rooms, setRooms] = useState([])
  const [hotelImages, setHotelImages] = useState([])
  const [coords, setCoords] = useState(null)
  const [geocoding, setGeocoding] = useState(false)
  const isEdit = !!id

  // 加载酒店数据
  useEffect(() => {
    if (isEdit) {
      const loadHotel = async () => {
        setLoading(true)
        try {
          const res = await fetch(`http://localhost:3001/api/hotels/${id}`)
          const result = await res.json()
          const hotel = result.data
          if (hotel) {
            form.setFieldsValue({
              name: hotel.name,
              city: hotel.city,
              stars: hotel.star_rating,
              address: hotel.address,
              phone: hotel.phone,
              description: hotel.description,
              facilities: hotel.facilities?.split('、') || [],
            })
            // 加载房型数据，按价格排序
            const sortedRooms = (hotel.rooms || []).sort((a, b) => a.price - b.price)
            setRooms(sortedRooms)
            // 加载图片
            const imgs = hotel.images || []
            setHotelImages(imgs.length > 0 ? imgs.map((url, idx) => ({
              uid: `-${idx}`,
              name: `image${idx}.jpg`,
              status: 'done',
              url: url,
            })) : [])
            // 加载已保存的坐标
            if (hotel.latitude && hotel.longitude) {
              setCoords({ lat: hotel.latitude, lng: hotel.longitude })
            }
          }
        } catch (error) {
          console.error('加载失败:', error)
          message.error('加载酒店数据失败')
        } finally {
          setLoading(false)
        }
      }
      loadHotel()
    } else {
      // 新增时默认添加一个房型
      setRooms([{
        id: Date.now(),
        name: '标准间',
        price: 299,
        discount_price: '',
        bed_type: '大床1.8m',
        area: 25,
        max_guests: 2,
        description: '舒适标准间，设施齐全',
      }])
    }
  }, [id, isEdit, form])

  // 地址解析获取坐标
  const handleGeocode = async (address) => {
    if (!address) {
      message.warning('请先输入详细地址')
      return
    }
    
    const city = form.getFieldValue('city')
    if (!city) {
      message.warning('请先选择城市')
      return
    }
    
    setGeocoding(true)
    
    try {
      // 使用腾讯地图 WebService API 进行地址解析
      // 需要申请 key，这里使用前端备用方案：iframe 方式加载腾讯地图进行解析
      // 或者使用 TMap 的 Geocoder
      
      // 方案：使用浏览器 Geolocation + 城市中心点作为备选
      // 实际项目中应该调用后端 API 或腾讯地图 WebService
      
      // 模拟地址解析（实际项目中应调用腾讯地图 API）
      // 这里使用一个简单的方法：根据城市名称 + 地址特征进行简单偏移
      const baseCoords = cityCoords[city] || { lat: 31.2304, lng: 121.4737 }
      
      // 调用腾讯地图 Geocoder（需要在前端引入 TMap）
      if (window.TMap) {
        const geocoder = new window.TMap.service.Geocoder()
        const result = await new Promise((resolve, reject) => {
          geocoder.getLocation({
            address: address,
            region: city,
          }, (res) => {
            if (res.status === 0 && res.result) {
              resolve({
                lat: res.result.location.lat,
                lng: res.result.location.lng
              })
            } else {
              reject(new Error('地址解析失败'))
            }
          })
        })
        setCoords(result)
        message.success('坐标获取成功')
      } else {
        // 如果 TMap 未加载，使用模拟偏移（实际项目中应提示用户）
        // 这里添加一个小的随机偏移来模拟不同地址
        const hash = address.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0)
        const offset = 0.01 // 约1公里的偏移
        const mockCoords = {
          lat: baseCoords.lat + (hash % 1000) / 100000,
          lng: baseCoords.lng + (hash % 1000) / 100000
        }
        setCoords(mockCoords)
        message.success('坐标获取成功（模拟模式）')
        message.info('提示：接入腾讯地图 API 可获得更精确的坐标')
      }
    } catch (error) {
      console.error('地址解析失败:', error)
      message.error('地址解析失败，请检查地址是否正确')
      // 使用城市中心作为备选
      const city = form.getFieldValue('city')
      setCoords(cityCoords[city] || { lat: 31.2304, lng: 121.4737 })
    } finally {
      setGeocoding(false)
    }
  }

  // 添加房型
  const addRoom = () => {
    setRooms([...rooms, {
      id: Date.now(),
      name: '',
      price: '',
      discount_price: '',
      bed_type: '大床1.8m',
      area: 25,
      max_guests: 2,
      description: '',
    }])
  }

  // 删除房型
  const removeRoom = (index) => {
    const newRooms = rooms.filter((_, i) => i !== index)
    setRooms(newRooms)
  }

  // 更新房型
  const updateRoom = (index, field, value) => {
    const newRooms = [...rooms]
    newRooms[index] = { ...newRooms[index], [field]: value }
    setRooms(newRooms)
  }

  const onFinish = async (values) => {
    try {
      setLoading(true)
      
      // 验证房型数据
      const validRooms = rooms.filter(r => r.name && r.price)
      if (validRooms.length === 0) {
        message.error('请至少添加一个完整的房型')
        setLoading(false)
        return
      }

      // 获取坐标（优先使用用户解析的坐标，否则使用城市中心坐标）
      const finalCoords = coords || cityCoords[values.city] || { lat: 31.2304, lng: 121.4737 }
      
      // 计算最低价格
      const prices = validRooms.map(r => Number(r.discount_price) || Number(r.price))
      const minPrice = Math.min(...prices)
      
      // 构建房型数据（按价格排序）
      const formattedRooms = validRooms
        .map((r, idx) => ({
          id: r.id || Date.now() + idx,
          name: r.name,
          price: Number(r.price),
          discount_price: r.discount_price ? Number(r.discount_price) : null,
          bed_type: r.bed_type,
          area: Number(r.area) || 20,
          max_guests: Number(r.max_guests) || 2,
          description: r.description || '',
          images: [],
        }))
        .sort((a, b) => a.price - b.price)
      
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
        images: hotelImages.length > 0 ? hotelImages.map(f => f.url || f.thumbUrl || DEFAULT_HOTEL_IMAGE) : [DEFAULT_HOTEL_IMAGE],
        min_price: minPrice,
        rating: 4.5,
        review_count: 0,
        distance: '',
        latitude: finalCoords.lat,
        longitude: finalCoords.lng,
        merchant_id: user.id,
        status: 'published',  // 商户发布后立即可见
        rooms: formattedRooms,
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
    <Card title={isEdit ? '编辑酒店' : '新增酒店'} style={{ borderRadius: 12, maxWidth: 900 }} loading={loading}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <h3 style={{ marginBottom: 16, color: '#333' }}>基本信息</h3>
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
          <Input.Search 
            placeholder="请输入详细地址，如：北京市东城区王府井金鱼胡同8号"
            enterButton={<><EnvironmentOutlined /> 获取坐标</>}
            onSearch={handleGeocode}
            loading={geocoding}
          />
        </Form.Item>
        {coords && (
          <Form.Item>
            <Tag color="success">
              <EnvironmentOutlined /> 已获取坐标：纬度 {coords.lat.toFixed(4)}, 经度 {coords.lng.toFixed(4)}
            </Tag>
          </Form.Item>
        )}
        <Form.Item name="phone" label="联系电话" rules={[{ required: true }]}>
          <Input placeholder="请输入联系电话" />
        </Form.Item>
        <Form.Item name="facilities" label="设施服务">
          <Checkbox.Group options={FACILITIES} />
        </Form.Item>
        <Form.Item name="description" label="酒店描述">
          <TextArea rows={4} placeholder="请输入酒店描述" />
        </Form.Item>

        <Form.Item label="酒店图片">
          <Upload
            listType="picture-card"
            fileList={hotelImages}
            onChange={async ({ fileList }) => {
              // 将上传的文件转换为 base64
              const processedList = await Promise.all(
                fileList.map(async (file) => {
                  if (file.url || file.thumbUrl) {
                    return file;
                  }
                  // 新上传的文件，转换为 base64
                  return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      resolve({
                        ...file,
                        url: e.target?.result,
                        thumbUrl: e.target?.result,
                      });
                    };
                    reader.readAsDataURL(file.originFileObj);
                  });
                })
              );
              setHotelImages(processedList);
            }}
            beforeUpload={() => false} // 阻止自动上传
            maxCount={5}
            accept="image/*"
          >
            {hotelImages.length < 5 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传图片</div>
              </div>
            )}
          </Upload>
          <div style={{ color: '#999', fontSize: 12, marginTop: 8 }}>
            不上传则使用默认图片，最多5张
          </div>
        </Form.Item>

        <Divider style={{ margin: '24px 0' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, color: '#333' }}>房型管理</h3>
          <Button type="dashed" icon={<PlusOutlined />} onClick={addRoom}>
            添加房型
          </Button>
        </div>

        {rooms.map((room, index) => (
          <Card 
            key={room.id} 
            size="small" 
            title={`房型 ${index + 1}`}
            extra={
              rooms.length > 1 && (
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />} 
                  onClick={() => removeRoom(index)}
                >
                  删除
                </Button>
              )
            }
            style={{ marginBottom: 16, background: '#fafafa' }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <Form.Item label="房型名称" required style={{ marginBottom: 12 }}>
                <Input 
                  placeholder="如：豪华大床房" 
                  value={room.name}
                  onChange={e => updateRoom(index, 'name', e.target.value)}
                />
              </Form.Item>
              <Form.Item label="原价（元/晚）" required style={{ marginBottom: 12 }}>
                <InputNumber 
                  min={1} 
                  style={{ width: '100%' }} 
                  placeholder="原价"
                  value={room.price}
                  onChange={v => updateRoom(index, 'price', v)}
                />
              </Form.Item>
              <Form.Item label="优惠价（元/晚）" style={{ marginBottom: 12 }}>
                <InputNumber 
                  min={1} 
                  style={{ width: '100%' }} 
                  placeholder="不填则不显示优惠"
                  value={room.discount_price}
                  onChange={v => updateRoom(index, 'discount_price', v)}
                />
              </Form.Item>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <Form.Item label="床型" style={{ marginBottom: 12 }}>
                <Select 
                  value={room.bed_type}
                  onChange={v => updateRoom(index, 'bed_type', v)}
                  options={BED_TYPES.map(b => ({ value: b, label: b }))}
                />
              </Form.Item>
              <Form.Item label="面积（㎡）" style={{ marginBottom: 12 }}>
                <InputNumber 
                  min={5} 
                  style={{ width: '100%' }} 
                  value={room.area}
                  onChange={v => updateRoom(index, 'area', v)}
                />
              </Form.Item>
              <Form.Item label="可住人数" style={{ marginBottom: 12 }}>
                <InputNumber 
                  min={1} 
                  max={10}
                  style={{ width: '100%' }} 
                  value={room.max_guests}
                  onChange={v => updateRoom(index, 'max_guests', v)}
                />
              </Form.Item>
            </div>
            <Form.Item label="房型描述" style={{ marginBottom: 0 }}>
              <Input 
                placeholder="如：带落地窗、独立卫浴" 
                value={room.description}
                onChange={e => updateRoom(index, 'description', e.target.value)}
              />
            </Form.Item>
          </Card>
        ))}

        <Form.Item style={{ marginTop: 24 }}>
          <Space>
            <Button type="primary" htmlType="submit" size="large">
              {isEdit ? '保存修改' : '提交审核'}
            </Button>
            <Button size="large" onClick={() => navigate('/merchant/hotels')}>
              取消
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  )
}
