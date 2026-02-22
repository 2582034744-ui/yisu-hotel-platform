import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Hotel } from '../types';

interface FavoriteStore {
  favorites: Hotel[];
  addFavorite: (hotel: Hotel) => void;
  removeFavorite: (hotelId: number) => void;
  isFavorite: (hotelId: number) => boolean;
  clearFavorites: () => void;
}

export const useFavoriteStore = create<FavoriteStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      addFavorite: (hotel) => {
        set((state) => ({
          favorites: [...state.favorites.filter(h => h.id !== hotel.id), hotel]
        }));
      },
      
      removeFavorite: (hotelId) => {
        set((state) => ({
          favorites: state.favorites.filter(h => h.id !== hotelId)
        }));
      },
      
      isFavorite: (hotelId) => {
        return get().favorites.some(h => h.id === hotelId);
      },
      
      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: 'hotel-favorites',
    }
  )
);
