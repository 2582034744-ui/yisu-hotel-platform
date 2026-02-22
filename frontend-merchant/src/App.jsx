import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import MainLayout from './components/MainLayout'
import Login from './pages/auth/Login'
import MerchantHotels from './pages/merchant/MerchantHotels'
import HotelForm from './pages/merchant/HotelForm'
import AdminHotels from './pages/admin/AdminHotels'
import ReviewList from './pages/admin/ReviewList'
import ReviewDetail from './pages/admin/ReviewDetail'
import PublishedList from './pages/admin/PublishedList'

export default function App() {
  return (
    <ConfigProvider locale={zhCN} theme={{
      token: { colorPrimary: '#1677ff', borderRadius: 8 }
    }}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Merchant routes */}
            <Route path="/merchant" element={
              <ProtectedRoute role="merchant"><MainLayout /></ProtectedRoute>
            }>
              <Route path="hotels" element={<MerchantHotels />} />
              <Route path="add" element={<HotelForm />} />
              <Route path="edit/:id" element={<HotelForm />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin" element={
              <ProtectedRoute role="admin"><MainLayout /></ProtectedRoute>
            }>
              <Route path="hotels" element={<AdminHotels />} />
              <Route path="review" element={<ReviewList />} />
              <Route path="review/:id" element={<ReviewDetail />} />
              <Route path="published" element={<PublishedList />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  )
}
