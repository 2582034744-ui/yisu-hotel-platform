import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SearchBar,
  InfiniteScroll,
  PullToRefresh,
  Skeleton,
  Tag,
  Empty,
  Button,
  Calendar,
  Popup,
} from 'antd-mobile';
import { 
  LeftOutline, 
  EnvironmentOutline, 
  CalendarOutline,
  DownOutline,
  HeartOutline,
  HeartFill,
} from 'antd-mobile-icons';
import { useSearchStore } from '../store/searchStore';
import { useFavoriteStore } from '../store/favoriteStore';
import { getHotelList } from '../api/hotel';
import type { Hotel } from '../types';
import dayjs from 'dayjs';
import './HotelList.css';

// 排序选项
const sortOptions = [
  { label: '欢迎度', value: 'default' },
  { label: '价格最低', value: 'price_asc' },
  { label: '价格最高', value: 'price_desc' },
  { label: '评分最高', value: 'rating' },
];

// 城市列表
const cities = ['全部', '北京', '上海', '广州', '深圳', '杭州', '成都', '西安', '武汉', '厦门', '桂林', '丽江'];

// 星级选项
const starOptions = [
  { label: '全部', value: null },
  { label: '五星', value: 5 },
  { label: '四星', value: 4 },
  { label: '三星', value: 3 },
  { label: '二星及以下', value: 2 },
];

// 价格区间选项
const priceOptions = [
  { label: '全部价格', min: null, max: null },
  { label: '¥200以下', min: 0, max: 200 },
  { label: '¥200-500', min: 200, max: 500 },
  { label: '¥500-1000', min: 500, max: 1000 },
  { label: '¥1000以上', min: 1000, max: null },
];

export default function HotelList() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  
  // 收藏功能
  const { addFavorite, removeFavorite, isFavorite } = useFavoriteStore();
  
  // 本地筛选状态
  const [localCity, setLocalCity] = useState('全部');
  const [localStar, setLocalStar] = useState(starOptions[0]);
  const [localPrice, setLocalPrice] = useState(priceOptions[0]);
  const [showCityPopup, setShowCityPopup] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);

  const {
    keyword,
    city,
    checkinDate,
    checkoutDate,
    sortBy,
    page,
    pageSize,
    hasMore,
    setKeyword,
    setCity,
    setSortBy,
    setPage,
    setHasMore,
    setDates,
  } = useSearchStore();
  
  // 日历选择的临时状态
  const [tempDateRange, setTempDateRange] = useState<[Date, Date]>([new Date(checkinDate), new Date(checkoutDate)]);

  // 初始化时同步store的城市到本地
  useEffect(() => {
    if (city) {
      setLocalCity(city);
    } else if (keyword && cities.includes(keyword)) {
      setLocalCity(keyword);
    }
  }, []);

  // 加载酒店数据
  const loadHotels = useCallback(async (isRefresh = false, pageParam?: number) => {
    if (loading) return;
    setLoading(true);

    try {
      const currentPage = isRefresh ? 1 : (pageParam || page);
      
      // 构建搜索参数
      const searchParams: any = {
        keyword: keyword || (localCity !== '全部' ? localCity : ''),
        city: localCity !== '全部' ? localCity : '',
        star_rating: localStar.value,
        min_price: localPrice.min,
        max_price: localPrice.max,
        sort_by: sortBy === 'default' ? undefined : sortBy,
        page: currentPage,
        pageSize,
      };

      console.log('搜索参数:', searchParams);

      const res = await getHotelList(searchParams);
      const newHotels = res.data || [];

      if (isRefresh) {
        setHotels(newHotels);
        setPage(1);
      } else {
        setHotels(prev => {
          const existingIds = new Set(prev.map(h => h.id));
          const filtered = newHotels.filter((h) => !existingIds.has(h.id));
          return [...prev, ...filtered];
        });
        setPage(currentPage);
      }

      setHasMore(newHotels.length === pageSize);
    } catch (error) {
      console.error('加载酒店列表失败:', error);
    } finally {
      setLoading(false);
    }
  }, [keyword, localCity, localStar.value, localPrice.min, localPrice.max, sortBy, page, pageSize]);

  // 当依赖变化时重新加载
  useEffect(() => {
    setHotels([]);
    loadHotels(true, 1);
  }, [keyword, localCity, localStar.value, localPrice.min, localPrice.max, sortBy]);

  // 加载更多
  const loadMore = async () => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    await loadHotels(false, nextPage);
  };

  // 下拉刷新
  const onRefresh = async () => {
    await loadHotels(true, 1);
  };

  // 获取入住天数
  const getNights = () => {
    return dayjs(checkoutDate).diff(dayjs(checkinDate), 'day');
  };

  // 处理日期选择
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

  // 处理城市选择
  const handleCitySelect = (selectedCity: string) => {
    setLocalCity(selectedCity);
    if (selectedCity !== '全部') {
      setCity(selectedCity);
      setKeyword(selectedCity);
    }
    setShowCityPopup(false);
  };

  // 应用筛选
  const applyFilters = () => {
    setShowFilterPopup(false);
    loadHotels(true, 1);
  };

  // 清除筛选
  const clearFilters = () => {
    setLocalStar(starOptions[0]);
    setLocalPrice(priceOptions[0]);
  };

  // 处理收藏
  const handleFavorite = (e: React.MouseEvent, hotel: Hotel) => {
    e.stopPropagation();
    if (isFavorite(hotel.id)) {
      removeFavorite(hotel.id);
    } else {
      addFavorite(hotel);
    }
  };

  // 渲染酒店卡片
  const renderHotelCard = (hotel: Hotel) => (
    <div
      key={hotel.id}
      className="hotel-card"
      onClick={() => navigate(`/detail/${hotel.id}`)}
    >
      <div className="hotel-image-wrapper">
        <img
          src={hotel.images?.[0] || 'https://via.placeholder.com/200'}
          alt={hotel.name}
          loading="lazy"
        />
        {hotel.min_price && hotel.min_price < 500 && (
          <span className="discount-tag">特惠</span>
        )}
        <div 
          className="favorite-btn"
          onClick={(e) => handleFavorite(e, hotel)}
        >
          {isFavorite(hotel.id) ? (
            <HeartFill color="#ff4d4f" />
          ) : (
            <HeartOutline color="#fff" />
          )}
        </div>
      </div>
      <div className="hotel-content">
        <h4 className="hotel-name">{hotel.name}</h4>
        <div className="hotel-tags-row">
          <span className="star-badge">{'★'.repeat(hotel.star_rating || 0)}</span>
          <span className="hotel-type">
            {hotel.star_rating >= 5 ? '豪华型' : hotel.star_rating >= 4 ? '高档型' : '舒适型'}
          </span>
        </div>
        <p className="hotel-address">
          <EnvironmentOutline /> {hotel.address}
        </p>
        <div className="hotel-features">
          {hotel.facilities?.includes('早餐') && (
            <Tag color="green" fill="outline" className="feature-tag">含早餐</Tag>
          )}
          {hotel.facilities?.includes('取消') && (
            <Tag color="primary" fill="outline" className="feature-tag">免费取消</Tag>
          )}
          {hotel.facilities?.includes('停车') && (
            <Tag color="default" fill="outline" className="feature-tag">停车</Tag>
          )}
        </div>
        <div className="hotel-footer">
          <div className="rating-section">
            <span className="rating-badge">{hotel.rating || '4.5'}分</span>
            <span className="review-count">{hotel.review_count || 2000}+条评价</span>
          </div>
          <div className="price-section">
            <span className="price-symbol">¥</span>
            <span className="price-num">{hotel.min_price || 0}</span>
            <span className="price-unit">起</span>
          </div>
        </div>
      </div>
    </div>
  );

  // 渲染骨架屏
  const renderSkeleton = () => (
    <div className="skeleton-list">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="skeleton-hotel-card">
          <Skeleton animated className="skeleton-hotel-image" />
          <div className="skeleton-hotel-info">
            <Skeleton.Title animated style={{ width: '70%', marginBottom: 12 }} />
            <div className="skeleton-tags">
              <Skeleton animated className="skeleton-tag" />
              <Skeleton animated className="skeleton-tag" />
            </div>
            <Skeleton.Paragraph lineCount={1} animated style={{ width: '90%' }} />
            <div className="skeleton-footer">
              <Skeleton animated className="skeleton-rating" />
              <Skeleton animated className="skeleton-price" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="hotel-list-page">
      {/* 顶部固定区域 */}
      <div className="sticky-header">
        {/* 导航栏 */}
        <div className="nav-bar">
          <div className="back-btn" onClick={() => navigate(-1)}>
            <LeftOutline />
          </div>
          <div className="nav-title" onClick={() => setShowCityPopup(true)}>
            <EnvironmentOutline />
            <span>{localCity}</span>
            <DownOutline className="dropdown-icon" />
          </div>
          <div className="nav-actions">
            <div className="nav-icon-btn" onClick={() => navigate('/map')}>
              <EnvironmentOutline />
              <span>地图</span>
            </div>
            <div className="nav-icon-btn" onClick={() => navigate('/favorites')}>
              <HeartOutline />
              <span>收藏</span>
            </div>
          </div>
        </div>

        {/* 搜索栏 */}
        <div className="search-bar-wrapper">
          <SearchBar
            placeholder="搜索酒店名称"
            value={keyword}
            onChange={(val) => {
              setKeyword(val);
              if (!val) {
                loadHotels(true, 1);
              }
            }}
            className="list-search"
          />
        </div>

        {/* 日期选择栏 */}
        <div className="date-selector-bar" onClick={() => setCalendarVisible(true)}>
          <div className="date-item">
            <span className="date-label">入住</span>
            <span className="date-value">{dayjs(checkinDate).format('MM月DD日')}</span>
          </div>
          <div className="date-arrow">
            <span className="nights-badge">{getNights()}晚</span>
          </div>
          <div className="date-item">
            <span className="date-label">离店</span>
            <span className="date-value">{dayjs(checkoutDate).format('MM月DD日')}</span>
          </div>
          <CalendarOutline className="calendar-icon" />
        </div>

        {/* 筛选栏 */}
        <div className="filter-bar">
          <div className="sort-tabs">
            {sortOptions.map((option) => (
              <div
                key={option.value}
                className={`sort-tab ${sortBy === option.value ? 'active' : ''}`}
                onClick={() => setSortBy(option.value as any)}
              >
                {option.label}
              </div>
            ))}
          </div>
          <div className="filter-btn" onClick={() => setShowFilterPopup(true)}>
            筛选 <DownOutline />
          </div>
        </div>

        {/* 当前筛选显示 */}
        <div className="current-filter">
          {localCity !== '全部' && <Tag color="primary" className="filter-tag">{localCity}</Tag>}
          {localStar.value && <Tag color="primary" className="filter-tag">{localStar.label}</Tag>}
          {localPrice.label !== '全部价格' && <Tag color="primary" className="filter-tag">{localPrice.label}</Tag>}
        </div>
      </div>

      {/* 酒店列表 */}
      <div className="hotel-list-content">
        <PullToRefresh onRefresh={onRefresh}>
          {loading && hotels.length === 0 ? (
            renderSkeleton()
          ) : hotels.length === 0 ? (
            <Empty
              style={{ padding: '64px 0' }}
              imageStyle={{ width: 128 }}
              description="暂无符合条件的酒店"
            />
          ) : (
            <>
              <div className="result-count">
                共找到 <span>{hotels.length}</span> 家酒店
              </div>
              <div className="hotels-list">
                {hotels.map(renderHotelCard)}
              </div>
              <InfiniteScroll loadMore={loadMore} hasMore={hasMore}>
                <span>{hasMore ? '加载中...' : '没有更多了'}</span>
              </InfiniteScroll>
            </>
          )}
        </PullToRefresh>
      </div>

      {/* 城市选择弹窗 */}
      <Popup
        visible={showCityPopup}
        onMaskClick={() => setShowCityPopup(false)}
        bodyStyle={{ height: '60vh', borderRadius: '16px 16px 0 0' }}
      >
        <div className="popup-content">
          <div className="popup-header">
            <span>选择城市</span>
          </div>
          <div className="city-grid-popup">
            {cities.map((c) => (
              <div
                key={c}
                className={`city-option-popup ${localCity === c ? 'active' : ''}`}
                onClick={() => handleCitySelect(c)}
              >
                {c}
              </div>
            ))}
          </div>
        </div>
      </Popup>

      {/* 筛选弹窗 */}
      <Popup
        visible={showFilterPopup}
        onMaskClick={() => setShowFilterPopup(false)}
        bodyStyle={{ height: '70vh', borderRadius: '16px 16px 0 0' }}
      >
        <div className="popup-content">
          <div className="popup-header">
            <span>筛选</span>
            <span className="clear-btn" onClick={clearFilters}>清除</span>
          </div>

          <div className="filter-sections">
            {/* 星级筛选 */}
            <div className="filter-block">
              <h4>酒店星级</h4>
              <div className="filter-options">
                {starOptions.map((option) => (
                  <div
                    key={option.label}
                    className={`filter-option ${localStar.value === option.value ? 'active' : ''}`}
                    onClick={() => setLocalStar(option)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            </div>

            {/* 价格筛选 */}
            <div className="filter-block">
              <h4>价格区间</h4>
              <div className="filter-options">
                {priceOptions.map((option) => (
                  <div
                    key={option.label}
                    className={`filter-option ${localPrice.label === option.label ? 'active' : ''}`}
                    onClick={() => setLocalPrice(option)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="popup-footer">
            <Button block color="primary" onClick={applyFilters}>
              查看结果
            </Button>
          </div>
        </div>
      </Popup>

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
    </div>
  );
}
