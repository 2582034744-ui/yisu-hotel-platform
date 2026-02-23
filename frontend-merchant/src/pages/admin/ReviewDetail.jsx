import { Card, Descriptions, Tag, Button, Space, Modal, Input, message, Divider, Table } from 'antd'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CheckOutlined, CloseOutlined, SendOutlined, PoweroffOutlined } from '@ant-design/icons'

const statusMap = {
  draft: { color: 'default', text: '草稿' },
  pending: { color: 'orange', text: '待审核' },
  published: { color: 'green', text: '已发布' },
  approved: { color: 'green', text: '已发布' },
  rejected: { color: 'red', text: '已拒绝' },
  offline: { color: 'gray', text: '已下线' },
}

export default function ReviewDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(false)
  const [rejectModal, setRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  // 加载酒店数据 - 直接调用详情API获取完整数据（包含房间）
  const loadHotel = async () => {
    setLoading(true)
    try {
      // 使用admin API获取酒店详情（包含所有字段）
      const res = await fetch(`http://localhost:3001/api/admin/hotels?page=1&pageSize=100`)
      const data = await res.json()
      const found = (data.data || []).find(h => h.id === Number(id))
      
      if (found) {
        // 再获取完整的酒店详情（包含房间信息）
        const detailRes = await fetch(`http://localhost:3001/api/hotels/${id}`)
        if (detailRes.ok) {
          const detailData = await detailRes.json()
          setHotel({ ...found, ...detailData.data })
        } else {
          // 如果详情API返回404（可能是offline状态），就用admin数据
          setHotel(found)
        }
      }
    } catch (error) {
      console.error('加载失败:', error)
      message.error('加载酒店数据失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHotel()
  }, [id])

  const updateStatus = async (status, extra = {}) => {
    try {
      const res = await fetch(`http://localhost:3001/api/admin/hotels/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, ...extra }),
      })
      
      if (res.ok) {
        message.success(status === 'published' ? '审核通过' : '已拒绝')
        // 重新加载
        loadHotel()
      } else {
        message.error('操作失败')
      }
    } catch (error) {
      message.error('操作失败')
    }
  }

  // 管理员上下线酒店
  const toggleHotelStatus = async (action) => {
    try {
      const res = await fetch(`http://localhost:3001/api/admin/hotels/${id}/toggle-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      const data = await res.json()
      if (res.ok) {
        message.success(data.message)
        loadHotel()
      } else {
        message.error(data.message || '操作失败')
      }
    } catch (error) {
      console.error('操作失败:', error)
      message.error('操作失败')
    }
  }

  const handleReject = () => {
    if (!rejectReason.trim()) return message.warning('请填写拒绝原因')
    updateStatus('rejected', { reject_reason: rejectReason })
    setRejectModal(false)
  }

  if (loading) return <Card>加载中...</Card>
  if (!hotel) return <Card>酒店不存在</Card>

  // 房间列表列定义
  const roomColumns = [
    { title: '房型名称', dataIndex: 'name', key: 'name' },
    { title: '原价', dataIndex: 'price', key: 'price', render: v => `¥${v}` },
    { title: '优惠价', dataIndex: 'discount_price', key: 'discount_price', render: v => v ? `¥${v}` : '-' },
    { title: '床型', dataIndex: 'bed_type', key: 'bed_type' },
    { title: '面积', dataIndex: 'area', key: 'area', render: v => `${v}㎡` },
    { title: '可住人数', dataIndex: 'max_guests', key: 'max_guests', render: v => `${v}人` },
  ]

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={16}>
      <Card
        title="酒店详情"
        style={{ borderRadius: 12 }}
        extra={
          <Space>
            {hotel.status === 'pending' && (
              <>
                <Button type="primary" icon={<CheckOutlined />} onClick={() => updateStatus('published')}>
                  通过审核
                </Button>
                <Button danger icon={<CloseOutlined />} onClick={() => setRejectModal(true)}>
                  拒绝
                </Button>
              </>
            )}
            {(hotel.status === 'published' || hotel.status === 'approved') && (
              <Button 
                icon={<PoweroffOutlined />} 
                danger
                onClick={() => toggleHotelStatus('offline')}
              >
                下线酒店
              </Button>
            )}
            {hotel.status === 'offline' && (
              <Button 
                type="primary"
                icon={<SendOutlined />} 
                onClick={() => toggleHotelStatus('online')}
              >
                上线酒店
              </Button>
            )}
            <Button onClick={() => navigate(-1)}>返回</Button>
          </Space>
        }
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="酒店名称" span={2}>{hotel.name}</Descriptions.Item>
          <Descriptions.Item label="城市">{hotel.city}</Descriptions.Item>
          <Descriptions.Item label="星级">{'⭐'.repeat(hotel.stars || hotel.star_rating)}</Descriptions.Item>
          <Descriptions.Item label="详细地址" span={2}>{hotel.address}</Descriptions.Item>
          <Descriptions.Item label="价格/晚">¥{hotel.price || hotel.min_price}</Descriptions.Item>
          <Descriptions.Item label="联系电话">{hotel.phone}</Descriptions.Item>
          <Descriptions.Item label="所属商户">{hotel.merchantName || `商户${hotel.merchant_id}`}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={statusMap[hotel.status]?.color}>{statusMap[hotel.status]?.text}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="设施服务" span={2}>
            {Array.isArray(hotel.facilities) 
              ? hotel.facilities.map(f => <Tag key={f}>{f}</Tag>)
              : (hotel.facilities || '').split('、').filter(f => f).map(f => <Tag key={f}>{f}</Tag>)
            }
          </Descriptions.Item>
          <Descriptions.Item label="酒店描述" span={2}>{hotel.description}</Descriptions.Item>
          {hotel.reject_reason && (
            <Descriptions.Item label="拒绝原因" span={2}>
              <span style={{ color: 'red' }}>{hotel.reject_reason}</span>
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {/* 房间信息 */}
      {hotel.rooms && hotel.rooms.length > 0 && (
        <Card title="房型信息" style={{ borderRadius: 12 }}>
          <Table 
            dataSource={hotel.rooms} 
            columns={roomColumns} 
            rowKey="id" 
            pagination={false}
            size="small"
          />
        </Card>
      )}

      <Modal title="拒绝原因" open={rejectModal} onOk={handleReject} onCancel={() => setRejectModal(false)}>
        <Input.TextArea
          rows={4} placeholder="请填写拒绝原因"
          value={rejectReason} onChange={e => setRejectReason(e.target.value)}
        />
      </Modal>
    </Space>
  )
}
