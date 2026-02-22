import { Card, Descriptions, Tag, Button, Space, Modal, Input, message, Divider } from 'antd'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getHotels } from '../../utils/mockData'
import { CheckOutlined, CloseOutlined, SendOutlined } from '@ant-design/icons'

const statusMap = {
  draft: { color: 'default', text: '草稿' },
  pending: { color: 'orange', text: '待审核' },
  published: { color: 'green', text: '已发布' },
  rejected: { color: 'red', text: '已拒绝' },
}

export default function ReviewDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(false)
  const [rejectModal, setRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  // 加载酒店数据
  useEffect(() => {
    const loadHotel = async () => {
      setLoading(true)
      const data = await getHotels()
      const found = data.find(h => h.id === Number(id))
      setHotel(found)
      setLoading(false)
    }
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
        const data = await getHotels()
        const found = data.find(h => h.id === Number(id))
        setHotel(found)
      } else {
        message.error('操作失败')
      }
    } catch (error) {
      message.error('操作失败')
    }
  }

  const handleReject = () => {
    if (!rejectReason.trim()) return message.warning('请填写拒绝原因')
    updateStatus('rejected', { rejectReason })
    setRejectModal(false)
  }

  if (loading) return <Card>加载中...</Card>
  if (!hotel) return <Card>酒店不存在</Card>

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
            {hotel.status === 'published' && (
              <Button icon={<SendOutlined />} disabled>已发布</Button>
            )}
            <Button onClick={() => navigate(-1)}>返回</Button>
          </Space>
        }
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="酒店名称" span={2}>{hotel.name}</Descriptions.Item>
          <Descriptions.Item label="城市">{hotel.city}</Descriptions.Item>
          <Descriptions.Item label="星级">{'⭐'.repeat(hotel.stars)}</Descriptions.Item>
          <Descriptions.Item label="详细地址" span={2}>{hotel.address}</Descriptions.Item>
          <Descriptions.Item label="价格/晚">¥{hotel.price}</Descriptions.Item>
          <Descriptions.Item label="联系电话">{hotel.phone}</Descriptions.Item>
          <Descriptions.Item label="所属商户">{hotel.merchantName}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={statusMap[hotel.status]?.color}>{statusMap[hotel.status]?.text}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="设施服务" span={2}>
            {(hotel.facilities || []).map(f => <Tag key={f}>{f}</Tag>)}
          </Descriptions.Item>
          <Descriptions.Item label="酒店描述" span={2}>{hotel.description}</Descriptions.Item>
          {hotel.rejectReason && (
            <Descriptions.Item label="拒绝原因" span={2}>
              <span style={{ color: 'red' }}>{hotel.rejectReason}</span>
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      <Modal title="拒绝原因" open={rejectModal} onOk={handleReject} onCancel={() => setRejectModal(false)}>
        <Input.TextArea
          rows={4} placeholder="请填写拒绝原因"
          value={rejectReason} onChange={e => setRejectReason(e.target.value)}
        />
      </Modal>
    </Space>
  )
}
