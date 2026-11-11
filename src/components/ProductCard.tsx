import React from 'react';
import type { Product } from '../types/store';
import { POKEMON_TYPE_COLORS } from '../types/store';
import { Star, ShoppingBag, Heart, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onSelect: (p: Product) => void;
  isAddedJustNow?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onSelect,
  isAddedJustNow,
}) => {
  const discountRate = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const typeStyle = product.pokemon_type
    ? POKEMON_TYPE_COLORS[product.pokemon_type]
    : null;

  const badgeStyle = {
    BEST: 'bg-red-500 text-white',
    HOT: 'bg-amber-500 text-white',
    NEW: 'bg-emerald-500 text-white',
    LIMITED: 'bg-purple-600 text-white',
  }[product.badge || ''] || 'bg-slate-700 text-white';

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200 hover:border-red-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Badges & Wishlist Header */}
      <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {product.badge && (
            <span className={`text-[10px] font-black tracking-wider px-2 py-0.5 rounded-full shadow-sm ${badgeStyle}`}>
              {product.badge}
            </span>
          )}
          {product.pokemon_type && typeStyle && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-sm ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}>
              #{product.pokemon_type}
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`p-2 rounded-full backdrop-blur-md transition-all pointer-events-auto shadow-sm ${
            isWishlisted
              ? 'bg-rose-50 text-rose-500'
              : 'bg-white/80 hover:bg-white text-slate-400 hover:text-rose-500'
          }`}
          title={isWishlisted ? '찜 해제' : '찜하기'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Image Area */}
      <div
        onClick={() => onSelect(product)}
        className="relative pt-[85%] bg-gradient-to-b from-slate-50 to-slate-100/60 overflow-hidden cursor-pointer"
      >
        <img
          src={product.image_url}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain p-6 transform group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        {/* Subtle decorative background circle */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent opacity-80 pointer-events-none"></div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div onClick={() => onSelect(product)} className="cursor-pointer space-y-1.5">
          {product.name_en && (
            <p className="text-[11px] text-slate-400 font-medium tracking-tight truncate">
              {product.name_en}
            </p>
          )}

          <h3 className="font-bold text-sm text-slate-800 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating & Stock */}
          <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
            <div className="flex items-center gap-1 font-bold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.rating?.toFixed(1) || '5.0'}</span>
            </div>
            <span className="text-slate-300">•</span>
            <span>리뷰 {product.review_count || 0}</span>
            {product.stock !== null && product.stock <= 10 && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-red-500 font-bold text-[11px]">품절임박 ({product.stock}개 남음)</span>
              </>
            )}
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            {discountRate > 0 && product.original_price && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400 line-through">
                  {product.original_price.toLocaleString()}원
                </span>
                <span className="text-xs font-black text-red-500">
                  {discountRate}% OFF
                </span>
              </div>
            )}
            <div className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
              {product.price.toLocaleString()}
              <span className="text-xs font-normal text-slate-600 ml-0.5">원</span>
            </div>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className={`p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center shadow-sm ${
              isAddedJustNow
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-red-600 text-white active:scale-90'
            }`}
            title="장바구니 담기"
          >
            {isAddedJustNow ? (
              <Check className="w-4 h-4 animate-scale" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
