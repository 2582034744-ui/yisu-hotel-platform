import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  NavBar,
  Swiper,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  Toast,
  Skeleton,
  Calendar,
  Popup,
} from 'antd-mobile';
import { LeftOutline, HeartOutline, HeartFill, EnvironmentOutline } from 'antd-mobile-icons';
import { getHotelDetail } from '../api/hotel';
import { useSearchStore } from '../store/searchStore';
import type { Hotel, RoomType, NearbyPlace } from '../types';
import dayjs from 'dayjs';
import './HotelDetail.css';

export default function HotelDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);

  const { checkinDate, checkoutDate, setDates } = useSearchStore();
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [tempDateRange, setTempDateRange] = useState<[Date, Date]>([new Date(checkinDate), new Date(checkoutDate)]);

  // 计算入住天数
  const getNights = () => {
    if (!checkinDate || !checkoutDate) return 1;
    const diff = dayjs(checkoutDate).diff(dayjs(checkinDate), 'day');
    return diff > 0 ? diff : 1;
  };

  // 计算房间总价
  const getRoomTotalPrice = (room: RoomType) => {
    const nights = getNights();
    const pricePerNight = room.discount_price || room.price;
    return pricePerNight * nights;
  };

  // 加载酒店详情
  useEffect(() => {
    if (id) {
      loadHotelDetail();
    }
  }, [id]);

  const loadHotelDetail = async () => {
    setLoading(true);
    try {
      const res = await getHotelDetail(Number(id));
      setHotel(res.data);
    } catch (error) {
      console.error('加载酒店详情失败:', error);
      Toast.show({ content: '加载失败', position: 'center' });
    } finally {
      setLoading(false);
    }
  };

  // 处理预订
  const handleBooking = (room: RoomType) => {
    setSelectedRoom(room);
    setBookingModalVisible(true);
  };

  // 确认预订
  const confirmBooking = async (values: { name: string; phone: string }) => {
    Toast.show({
      content: '预订成功！',
      position: 'center',
    });
    setBookingModalVisible(false);
  };

  // 获取周边图标
  const getNearbyIcon = (type: string) => {
    switch (type) {
      case 'attraction': return '🌲';
      case 'transport': return '🚇';
      case 'shopping': return '🛍️';
      default: return '📍';
    }
  };

  // 获取周边类型文字
  const getNearbyTypeText = (type: string) => {
    switch (type) {
      case 'attraction': return '景点';
      case 'transport': return '交通';
      case 'shopping': return '商场';
      default: return '其他';
    }
  };

  // 处理日期选择变化
  const handleDateChange = (val: Date[]) => {
    if (val.length === 2) {
      setTempDateRange([val[0], val[1]]);
    }
  };

  // 确认日期选择
  const handleDateConfirm = () => {
    setDates(
      dayjs(tempDateRange[0]).format('YYYY-MM-DD'),
      dayjs(tempDateRange[1]).format('YYYY-MM-DD')
    );
    setCalendarVisible(false);
  };

  // 获取临时晚数
  const getTempNights = () => {
    return dayjs(tempDateRange[1]).diff(dayjs(tempDateRange[0]), 'day');
  };

  if (loading) {
    return (
      <div className="hotel-detail-page">
        <Skeleton animated className="detail-skeleton-banner" />
        <div className="detail-skeleton-content">
          <div className="skeleton-header">
            <Skeleton.Title animated style={{ width: '80%' }} />
            <div className="skeleton-tags-row">
              <Skeleton animated className="skeleton-tag-sm" />
              <Skeleton animated className="skeleton-tag-sm" />
            </div>
          </div>
          <div className="skeleton-info">
            <Skeleton.Paragraph lineCount={1} animated style={{ width: '60%' }} />
            <Skeleton.Paragraph lineCount={1} animated style={{ width: '90%' }} />
          </div>
          <div className="skeleton-section">
            <Skeleton.Title animated style={{ width: '40%', marginBottom: 12 }} />
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton-room">
                <Skeleton animated className="skeleton-room-left" />
                <div className="skeleton-room-right">
                  <Skeleton.Title animated style={{ width: '70%' }} />
                  <Skeleton.Paragraph lineCount={1} animated style={{ width: '50%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="hotel-detail-page">
        <NavBar back={<LeftOutline />} onBack={() => navigate(-1)}>酒店详情</NavBar>
        <div className="empty-state">酒店不存在</div>
      </div>
    );
  }

  const images = hotel.images || ['https://via.placeholder.com/400x300'];
  const rooms = hotel.rooms || [];
  const nearbyPlaces = hotel.nearby_places || [];
  const facilities = hotel.facilities?.split('、') || [];

  return (
    <div className="hotel-detail-page">
      {/* 顶部导航 */}
      <div className="detail-navbar">
        <div className="nav-back" onClick={() => navigate(-1)}>
          <LeftOutline />
        </div>
        <div
          className="nav-favorite"
          onClick={() => setIsFavorite(!isFavorite)}
        >
          {isFavorite ? <HeartFill color="#ff4d4f" /> : <HeartOutline />}
        </div>
      </div>

      {/* 图片轮播 */}
      <Swiper className="hotel-swiper" autoplay loop>
        {images.map((img, index) => (
          <Swiper.Item key={index}>
            <div
              className="swiper-image"
              style={{ backgroundImage: `url(${img})` }}
            />
          </Swiper.Item>
        ))}
      </Swiper>

      {/* 酒店基本信息 */}
      <div className="detail-content">
        <div className="hotel-header">
          <h1 className="hotel-name-lg">{hotel.name}</h1>
          {hotel.name_en && <p className="hotel-name-en">{hotel.name_en}</p>}
        </div>

        <div className="hotel-rating-row">
          <span className="stars-lg">{'★'.repeat(hotel.star_rating || 0)}</span>
          <Tag color="primary" className="hotel-type-tag">
            {hotel.star_rating >= 5 ? '豪华型' : hotel.star_rating >= 4 ? '高档型' : '舒适型'}
          </Tag>
          <span className="rating-score">{hotel.rating || '4.8'}分</span>
          <span className="review-count">{hotel.review_count || '2000+'}条评价</span>
        </div>

        <div className="hotel-address-row">
          <EnvironmentOutline />
          <span className="address-text">{hotel.address}</span>
        </div>

        {/* 设施标签 */}
        <div className="facilities-tags">
          {facilities.slice(0, 5).map((facility, index) => (
            <Tag key={index} color="default" className="facility-tag">
              {facility}
            </Tag>
          ))}
        </div>
      </div>

      {/* 日期选择栏 */}
      <div className="date-bar" onClick={() => setCalendarVisible(true)}>
        <div className="date-info">
          <span className="date-label">入住</span>
          <span className="date-value">{checkinDate}</span>
        </div>
        <div className="date-arrow">
          <span className="nights-tag">{getNights()}晚</span>
        </div>
        <div className="date-info">
          <span className="date-label">离店</span>
          <span className="date-value">{checkoutDate}</span>
        </div>
      </div>

      {/* 日历选择器弹窗 */}
      <Popup
        visible={calendarVisible}
        onMaskClick={() => setCalendarVisible(false)}
        bodyStyle={{ height: '85vh', borderRadius: '16px 16px 0 0' }}
        afterShow={() => setTempDateRange([new Date(checkinDate), new Date(checkoutDate)])}
      >
        <div className="calendar-popup">
          <div className="calendar-header">
            <span className="calendar-title">选择入住和离店日期</span>
            <span className="calendar-close" onClick={() => setCalendarVisible(false)}>✕</span>
          </div>
          <div className="calendar-dates-info">
            <div className="date-info-item">
              <span className="date-info-label">入住日期</span>
              <span className="date-info-value">{dayjs(tempDateRange[0]).format('MM月DD日')}</span>
            </div>
            <div className="date-info-arrow">→</div>
            <div className="date-info-item">
              <span className="date-info-label">离店日期</span>
              <span className="date-info-value">{dayjs(tempDateRange[1]).format('MM月DD日')}</span>
            </div>
          </div>
          <div className="calendar-body">
            <Calendar
              visible={true}
              onClose={() => setCalendarVisible(false)}
              onChange={handleDateChange}
              selectionMode="range"
              defaultValue={tempDateRange}
              min={new Date()}
            />
          </div>
          <div className="calendar-footer">
            <Button 
              block 
              color="primary" 
              onClick={handleDateConfirm}
            >
              确定 ({getTempNights()}晚)
            </Button>
          </div>
        </div>
      </Popup>

      {/* 房型列表 */}
      <div className="rooms-section">
        <h3 className="section-title">房型选择</h3>
        <div className="room-list">
          {rooms.map((room) => (
            <div key={room.id} className="room-card">
              <div className="room-info">
                <h4 className="room-name">{room.name}</h4>
                <p className="room-desc">{room.area}㎡ · {room.bed_type} · 可住{room.max_guests}人</p>
                <div className="room-tags">
                  {room.discount_price && (
                    <Tag color="danger" className="discount-tag">特惠</Tag>
                  )}
                </div>
              </div>
              <div className="room-price-action">
                <div className="price-box">
                  <div className="price-per-night">
                    <span className="price-label">每晚</span>
                    {room.discount_price && (
                      <span className="original-price">¥{room.price}</span>
                    )}
                    <span className="current-price">
                      ¥{room.discount_price || room.price}
                    </span>
                  </div>
                  <div className="price-total">
                    <span className="price-label">共{getNights()}晚</span>
                    <span className="total-price">¥{getRoomTotalPrice(room)}</span>
                  </div>
                </div>
                <Button
                  color="primary"
                  size="small"
                  onClick={() => handleBooking(room)}
                >
                  预订
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 酒店介绍 */}
      <div className="intro-section">
        <h3 className="section-title">酒店介绍</h3>
        <p className="intro-text">{hotel.description || '暂无酒店介绍'}</p>
      </div>

      {/* 周边信息 */}
      {nearbyPlaces.length > 0 && (
        <div className="nearby-section">
          <h3 className="section-title">周边信息</h3>
          <div className="nearby-list">
            {nearbyPlaces.map((place, index) => (
              <div key={index} className="nearby-item">
                <span className="nearby-icon">{getNearbyIcon(place.type)}</span>
                <div className="nearby-info">
                  <span className="nearby-name">{place.name}</span>
                  <Tag color="default" className="nearby-type">
                    {getNearbyTypeText(place.type)}
                  </Tag>
                </div>
                <span className="nearby-distance">{place.distance}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 底部预订栏 */}
      <div className="bottom-bar">
        <div className="bottom-price">
          <span className="price-prefix">起价</span>
          <span className="price-value">¥{hotel.min_price ? hotel.min_price * getNights() : (rooms[0] ? getRoomTotalPrice(rooms[0]) : 0)}</span>
          <span className="price-nights">/ {getNights()}晚</span>
        </div>
        <Button
          color="primary"
          size="large"
          className="book-btn"
          onClick={() => window.scrollTo({ top: document.querySelector('.rooms-section')?.getBoundingClientRect().top, behavior: 'smooth' })}
        >
          选择房型
        </Button>
      </div>

      {/* 预订弹窗 */}
      <Modal
        visible={bookingModalVisible}
        title="确认预订"
        onClose={() => setBookingModalVisible(false)}
        content={
          <div className="booking-modal-content">
            <div className="booking-info">
              <p className="booking-hotel">{hotel.name}</p>
              <p className="booking-room">{selectedRoom?.name}</p>
              <p className="booking-date">{checkinDate} 至 {checkoutDate}</p>
              <p className="booking-price">
                总价：<span className="price-highlight">¥{selectedRoom ? getRoomTotalPrice(selectedRoom) : 0}</span>
              </p>
            </div>
            <Form
              layout="vertical"
              onFinish={confirmBooking}
              footer={
                <Button block type="submit" color="primary" size="large">
                  确认预订
                </Button>
              }
            >
              <Form.Item
                name="name"
                label="入住人姓名"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input placeholder="请输入姓名" />
              </Form.Item>
              <Form.Item
                name="phone"
                label="联系电话"
                rules={[
                  { required: true, message: '请输入手机号' },
                  { pattern: /^1\d{10}$/, message: '请输入正确的手机号' },
                ]}
              >
                <Input placeholder="请输入手机号" type="tel" />
              </Form.Item>
            </Form>
          </div>
        }
      />
    </div>
  );
}
