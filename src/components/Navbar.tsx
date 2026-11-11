import React from 'react';
import { Search, ShoppingBag, Heart, Database as DbIcon, Package, Sparkles } from 'lucide-react';
import { SUPABASE_PROJECT_ID } from '../lib/supabase';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenOrders: () => void;
  onOpenMcpStatus: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenOrders,
  onOpenMcpStatus,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all shadow-sm">
      {/* Top micro banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 text-white text-xs py-1.5 px-4 font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
            <span>신규 트레이너 가입 시 <strong>10% 할인 쿠폰</strong> 즉시 지급! • 5만원 이상 <strong>무료 배송</strong></span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-white/90 text-[11px]">
            <span>공식 라이선스 정품 100%</span>
            <span>•</span>
            <button
              onClick={onOpenMcpStatus}
              className="hover:underline flex items-center gap-1.5 font-semibold text-yellow-200"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Supabase MCP 연결됨 ({SUPABASE_PROJECT_ID.slice(0, 6)}...)
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="relative w-10 h-10 flex-shrink-0">
            {/* Pokéball SVG */}
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md hover:rotate-12 transition-transform duration-300">
              <path d="M50 5A45 45 0 0 0 5 50h35a10 10 0 0 1 20 0h35A45 45 0 0 0 50 5z" fill="#EE1515" />
              <path d="M50 95A45 45 0 0 0 95 50H60a10 10 0 0 1-20 0H5a45 45 0 0 0 45 45z" fill="#FFFFFF" />
              <line x1="5" y1="50" x2="95" y2="50" stroke="#222" strokeWidth="6" />
              <circle cx="50" cy="50" r="14" fill="#222" />
              <circle cx="50" cy="50" r="8" fill="#FFF" stroke="#222" strokeWidth="2" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                POKÉMON <span className="text-red-600">STORE</span>
              </span>
              <span className="text-[10px] uppercase font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded tracking-wider">
                KOREA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">공식 포켓몬 굿즈 스토어</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-lg hidden sm:block relative">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="포켓몬 이름, 인형, 피규어, 후드티 검색..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-100 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-red-500 rounded-full text-sm transition-all outline-none focus:ring-2 focus:ring-red-100"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-full w-4 h-4 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* MCP Status Button */}
          <button
            onClick={onOpenMcpStatus}
            title="Supabase MCP 상태 및 도구 열기"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full border border-slate-200 transition-colors"
          >
            <DbIcon className="w-4 h-4 text-emerald-600" />
            <span className="hidden md:inline">Supabase MCP</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </button>

          {/* Orders Lookup Button */}
          <button
            onClick={onOpenOrders}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-full border border-slate-200 transition-colors"
            title="주문 내역 조회"
          >
            <Package className="w-4 h-4" />
            <span className="hidden sm:inline">주문 내역</span>
          </button>

          {/* Wishlist Button */}
          <div className="relative">
            <button
              className="p-2.5 text-slate-700 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors relative"
              title="찜한 상품"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scale">
                  {wishlistCount}
                </span>
              )}
            </button>
          </div>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-full font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2.5 w-4 h-4 bg-amber-400 text-slate-900 text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-red-600">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">장바구니</span>
          </button>
        </div>
      </div>

      {/* Mobile Search Input */}
      <div className="px-4 pb-3 sm:hidden">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="포켓몬 이름, 굿즈 검색..."
            className="w-full pl-10 pr-10 py-2 bg-slate-100 focus:bg-white border border-slate-200 focus:border-red-500 rounded-full text-xs outline-none"
          />
        </div>
      </div>
    </header>
  );
};
