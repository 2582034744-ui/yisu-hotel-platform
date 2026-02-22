import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatePicker, Button } from 'antd-mobile';
import { EnvironmentOutline, CalendarOutline, SearchOutline } from 'antd-mobile-icons';
import dayjs from 'dayjs';
import { useSearchStore } from '../store/searchStore';
import { getRecommendedHotels } from '../api/hotel';
import type { Hotel } from '../types';
import './Home.css';

// 热门城市
const hotCities = ['上海', '北京', '广州', '深圳', '杭州', '成都', '西安', '厦门'];

export default function Home() {
  const navigate = useNavigate();
  const [recommended, setRecommended] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [dateType, setDateType] = useState<'checkin' | 'checkout'>('checkin');
  const [localKeyword, setLocalKeyword] = useState('');

  const {
    keyword,
    city,
    checkinDate,
    checkoutDate,
    setKeyword,
    setCity,
    setDates,
    resetFilters,
  } = useSearchStore();

  // 加载推荐酒店
  useEffect(() => {
    loadRecommended();
    // 同步localKeyword到store的keyword
    setLocalKeyword(keyword);
  }, []);

  const loadRecommended = async () => {
    setLoading(true);
    try {
      const res = await getRecommendedHotels();
      setRecommended(res.data?.slice(0, 4) || []);
    } catch (error) {
      console.error('加载推荐失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理搜索 - 修复：先设置关键词，再重置其他筛选，最后跳转
  const handleSearch = () => {
    // 先保存搜索关键词到store
    if (localKeyword.trim()) {
      setKeyword(localKeyword.trim());
    }
    // 跳转时保留关键词
    navigate('/list');
  };

  // 选择城市
  const handleSelectCity = (selectedCity: string) => {
    setKeyword(selectedCity);
    setCity(selectedCity);
    navigate('/list');
  };

  // 处理日期选择
  const handleDateSelect = (date: Date) => {
    const dateStr = dayjs(date).format('YYYY-MM-DD');
    if (dateType === 'checkin') {
      // 确保入住日期不大于离店日期
      if (dayjs(dateStr).isAfter(checkoutDate)) {
        // 如果新入住日期大于当前离店日期，离店日期+1天
        setDates(dateStr, dayjs(dateStr).add(1, 'day').format('YYYY-MM-DD'));
      } else {
        setDates(dateStr, checkoutDate);
      }
    } else {
      // 确保离店日期不小于入住日期
      if (dayjs(dateStr).isBefore(checkinDate)) {
        setDates(dayjs(dateStr).subtract(1, 'day').format('YYYY-MM-DD'), dateStr);
      } else {
        setDates(checkinDate, dateStr);
      }
    }
    setDatePickerVisible(false);
  };

  // 获取入住天数
  const getNights = () => {
    return dayjs(checkoutDate).diff(dayjs(checkinDate), 'day');
  };

  // 获取星期显示
  const getWeekDay = (dateStr: string) => {
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weekDays[dayjs(dateStr).day()];
  };

  return (
    <div className="home-page">
      {/* 顶部Banner区域 */}
      <div className="home-banner">
        <h1 className="home-title">易宿酒店预订</h1>
        <p className="home-subtitle">全国优质酒店，安心预订</p>
      </div>

      {/* 搜索卡片 */}
      <div className="search-card">
        {/* 目的地输入 */}
        <div className="search-item">
          <div className="search-label">
            <EnvironmentOutline /> 目的地
          </div>
          <div className="search-input-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="请输入城市或酒店名称"
              value={localKeyword}
              onChange={(e) => setLocalKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <SearchOutline className="search-icon" onClick={handleSearch} />
          </div>
        </div>

        {/* 日期选择 */}
        <div className="search-item date-row">
          <div 
            className="date-box"
            onClick={() => { setDateType('checkin'); setDatePickerVisible(true); }}
          >
            <div className="date-label">入住</div>
            <div className="date-value">{dayjs(checkinDate).format('MM月DD日')}</div>
            <div className="date-week">{getWeekDay(checkinDate)}</div>
          </div>
          <div className="date-divider">
            <span className="nights-badge">{getNights()}晚</span>
          </div>
          <div 
            className="date-box"
            onClick={() => { setDateType('checkout'); setDatePickerVisible(true); }}
          >
            <div className="date-label">离店</div>
            <div className="date-value">{dayjs(checkoutDate).format('MM月DD日')}</div>
            <div className="date-week">{getWeekDay(checkoutDate)}</div>
          </div>
        </div>

        {/* 查询按钮 */}
        <Button
          color="primary"
          size="large"
          block
          onClick={handleSearch}
          className="search-btn"
        >
          查询酒店
        </Button>
      </div>

      {/* 热门城市 */}
      <div className="section hot-cities">
        <h3 className="section-title">热门城市</h3>
        <div className="cities-grid">
          {hotCities.map((cityName) => (
            <div
              key={cityName}
              className="city-item"
              onClick={() => handleSelectCity(cityName)}
            >
              {cityName}
            </div>
          ))}
        </div>
      </div>

      {/* 推荐酒店 */}
      <div className="section recommended-section">
        <div className="section-header">
          <h3 className="section-title">推荐酒店</h3>
          <span className="more-link" onClick={() => navigate('/list')}>查看更多 &gt;</span>
        </div>

        <div className="recommended-list">
          {recommended.map((hotel) => (
            <div
              key={hotel.id}
              className="recommended-card"
              onClick={() => navigate(`/detail/${hotel.id}`)}
            >
              <div className="recommended-image">
                <img
                  src={hotel.images?.[0] || 'https://via.placeholder.com/400x300'}
                  alt={hotel.name}
                  loading="lazy"
                />
              </div>
              <div className="recommended-info">
                <h4 className="recommended-name">{hotel.name}</h4>
                <div className="recommended-meta">
                  <span className="star-badge">{'★'.repeat(hotel.star_rating || 0)}</span>
                  <span className="rating">{hotel.rating || '4.5'}分</span>
                </div>
                <div className="recommended-price">
                  <span className="price-prefix">¥</span>
                  <span className="price-value">{hotel.min_price || 0}</span>
                  <span className="price-suffix">起</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 日期选择器 */}
      <DatePicker
        title={dateType === 'checkin' ? '选择入住日期' : '选择离店日期'}
        visible={datePickerVisible}
        onClose={() => setDatePickerVisible(false)}
        onConfirm={handleDateSelect}
        min={dateType === 'checkin' ? new Date() : new Date(checkinDate)}
        defaultValue={new Date(dateType === 'checkin' ? checkinDate : checkoutDate)}
      />
    </div>
  );
}
