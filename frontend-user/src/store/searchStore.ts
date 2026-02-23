import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import dayjs from 'dayjs'

interface SearchState {
    // 搜索条件
    keyword: string
    city: string
    checkinDate: string
    checkoutDate: string
    starRating: number | undefined
    minPrice: number | undefined
    maxPrice: number | undefined
    sortBy: 'default' | 'price_asc' | 'price_desc' | 'rating' | 'id'
    nearbyType: 'attraction' | 'transport' | 'shopping' | undefined

    // 分页
    page: number
    pageSize: number
    hasMore: boolean

    // Actions
    setKeyword: (keyword: string) => void
    setCity: (city: string) => void
    setDates: (checkin: string, checkout: string) => void
    setStarRating: (rating: number | undefined) => void
    setPriceRange: (min: number | undefined, max: number | undefined) => void
    setNearbyType: (type: 'attraction' | 'transport' | 'shopping' | undefined) => void
    setSortBy: (
        sort: 'default' | 'price_asc' | 'price_desc' | 'rating' | 'id',
    ) => void
    setPage: (page: number) => void
    setHasMore: (hasMore: boolean) => void
    resetFilters: () => void
    resetSort: () => void
    resetFiltersKeepKeyword: () => void
}

const defaultCheckin = dayjs().format('YYYY-MM-DD')
const defaultCheckout = dayjs().add(1, 'day').format('YYYY-MM-DD')

export const useSearchStore = create<SearchState>()(
    persist(
        (set) => ({
            keyword: '',
            city: '',
            checkinDate: defaultCheckin,
            checkoutDate: defaultCheckout,
            starRating: undefined,
            minPrice: undefined,
            maxPrice: undefined,
            sortBy: 'default',
            nearbyType: undefined,
            page: 1,
            pageSize: 10,
            hasMore: true,

            setKeyword: (keyword) => set({ keyword, page: 1 }),
            setCity: (city) => set({ city, page: 1 }),
            setDates: (checkin, checkout) =>
                set({
                    checkinDate: checkin,
                    checkoutDate: checkout,
                }),
            setStarRating: (rating) => set({ starRating: rating, page: 1 }),
            setPriceRange: (min, max) =>
                set({
                    minPrice: min,
                    maxPrice: max,
                    page: 1,
                }),
            setNearbyType: (type) => set({ nearbyType: type, page: 1 }),
            setSortBy: (sort) => set({ sortBy: sort, page: 1 }),
            setPage: (page) => set({ page }),
            setHasMore: (hasMore) => set({ hasMore }),
            resetFilters: () =>
                set({
                    keyword: '',
                    city: '',
                    starRating: undefined,
                    minPrice: undefined,
                    maxPrice: undefined,
                    sortBy: 'id',
                    nearbyType: undefined,
                    page: 1,
                }),
            resetSort: () =>
                set({
                    sortBy: 'id',
                    page: 1,
                }),
            resetFiltersKeepKeyword: () =>
                set({
                    starRating: undefined,
                    minPrice: undefined,
                    maxPrice: undefined,
                    sortBy: 'id',
                    nearbyType: undefined,
                    page: 1,
                }),
        }),
        {
            name: 'hotel-search-storage',
        },
    ),
)
