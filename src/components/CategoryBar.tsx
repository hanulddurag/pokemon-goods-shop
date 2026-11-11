import React from 'react';
import type { Category, PokemonType } from '../types/store';
import { POKEMON_TYPE_COLORS } from '../types/store';
import { SlidersHorizontal } from 'lucide-react';

interface CategoryBarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  selectedType: PokemonType;
  onSelectType: (t: PokemonType) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  totalProductsCount: number;
}

const POKEMON_TYPES: PokemonType[] = [
  '전체',
  '전기',
  '불꽃',
  '물',
  '풀',
  '에스퍼',
  '고스트',
  '노말',
  '페어리'
];

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedType,
  onSelectType,
  sortBy,
  onSortChange,
  totalProductsCount,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white shadow-slate-300'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          🎁 전체 상품
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center gap-2 ${
                isSelected
                  ? 'bg-red-600 text-white shadow-red-200'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Sub Bar: Pokemon Type Filter + Sorting */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Pokemon Type Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 pl-1 pr-2 flex items-center gap-1 flex-shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" /> 타입:
          </span>
          {POKEMON_TYPES.map((type) => {
            const isSelected = selectedType === type;
            const style = POKEMON_TYPE_COLORS[type];

            return (
              <button
                key={type}
                onClick={() => onSelectType(type)}
                className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm scale-105'
                    : style
                    ? `${style.bg} ${style.text} ${style.border} hover:opacity-80`
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                {type === '전체' ? '모든 타입' : `#${type}`}
              </button>
            );
          })}
        </div>

        {/* Count & Sort Selector */}
        <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
          <span className="text-xs text-slate-500 font-medium">
            총 <strong className="text-slate-900 font-bold">{totalProductsCount}</strong>개 굿즈
          </span>

          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-red-500 cursor-pointer text-slate-700"
          >
            <option value="featured">추천순</option>
            <option value="popularity">인기순 (평점순)</option>
            <option value="price-asc">낮은 가격순</option>
            <option value="price-desc">높은 가격순</option>
            <option value="newest">신상품순</option>
          </select>
        </div>
      </div>
    </div>
  );
};
