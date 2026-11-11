import type { Database } from './supabase';

export type Product = Database['public']['Tables']['products']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PokemonType =
  | '전체'
  | '전기'
  | '노말'
  | '불꽃'
  | '물'
  | '풀'
  | '에스퍼'
  | '고스트'
  | '페어리'
  | '드래곤';

export const POKEMON_TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  전기: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
  노말: { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300' },
  불꽃: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
  물: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
  풀: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' },
  에스퍼: { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-300' },
  고스트: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
  페어리: { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-300' },
  드래곤: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' },
};
