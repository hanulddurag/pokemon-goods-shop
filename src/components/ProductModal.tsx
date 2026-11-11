import React, { useState, useEffect } from 'react';
import type { Product, Review } from '../types/store';
import { POKEMON_TYPE_COLORS } from '../types/store';
import { supabase } from '../lib/supabase';
import { X, Star, ShoppingBag, ShieldCheck, Truck, RefreshCw, Send, Check } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (p: Product, qty: number) => void;
  onDirectBuy: (p: Product, qty: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onDirectBuy,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewContent, setNewReviewContent] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    if (product) {
      setQuantity(1);
      fetchReviews(product.id);
    }
  }, [product]);

  const fetchReviews = async (productId: string) => {
    setLoadingReviews(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setReviews(data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !newReviewAuthor.trim() || !newReviewContent.trim()) return;

    setSubmittingReview(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          product_id: product.id,
          author: newReviewAuthor.trim(),
          rating: newReviewRating,
          content: newReviewContent.trim(),
        })
        .select()
        .single();

      if (!error && data) {
        setReviews((prev) => [data, ...prev]);
        setNewReviewAuthor('');
        setNewReviewContent('');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!product) return null;

  const typeStyle = product.pokemon_type
    ? POKEMON_TYPE_COLORS[product.pokemon_type]
    : null;

  const discountRate = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleAddToCartClick = () => {
    onAddToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Image section */}
            <div className="space-y-4">
              <div className="relative pt-[100%] bg-gradient-to-b from-slate-50 to-slate-100 rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-contain p-8 hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-slate-500 font-medium">
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <ShieldCheck className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
                  <span>공식 라이선스</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <Truck className="w-4 h-4 mx-auto text-blue-600 mb-1" />
                  <span>우체국 안심배송</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <RefreshCw className="w-4 h-4 mx-auto text-amber-600 mb-1" />
                  <span>7일 안심 환불</span>
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  {product.badge && (
                    <span className="text-[10px] font-black tracking-wider px-2 py-0.5 rounded-full bg-red-600 text-white">
                      {product.badge}
                    </span>
                  )}
                  {product.pokemon_type && typeStyle && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}>
                      #{product.pokemon_type} 타입
                    </span>
                  )}
                  {product.pokemon_name && (
                    <span className="text-xs font-semibold text-slate-500">
                      {product.pokemon_name}
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {product.name}
                </h2>
                {product.name_en && (
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    {product.name_en}
                  </p>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 font-bold text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm">{product.rating?.toFixed(1) || '5.0'}</span>
                </div>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500">리뷰 {reviews.length}개</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-600 font-semibold">재고 {product.stock || 0}개</span>
              </div>

              {/* Price */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-baseline gap-2">
                  {discountRate > 0 && product.original_price && (
                    <>
                      <span className="text-sm text-slate-400 line-through">
                        {product.original_price.toLocaleString()}원
                      </span>
                      <span className="text-sm font-black text-red-600">
                        {discountRate}% 할인
                      </span>
                    </>
                  )}
                </div>
                <div className="text-2xl font-black text-slate-900">
                  {product.price.toLocaleString()}
                  <span className="text-sm font-normal text-slate-600 ml-1">원</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* Features List */}
              {product.features && product.features.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <p className="text-xs font-bold text-slate-800">상품 특장점:</p>
                  <ul className="space-y-1">
                    {product.features.map((feat, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                <span className="text-xs font-bold text-slate-700">수량 선택</span>
                <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-bold text-slate-800 min-w-[2.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCartClick}
                  className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all ${
                    addedNotice
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
                  }`}
                >
                  {addedNotice ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>담았습니다!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>장바구니 담기</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onDirectBuy(product, quantity)}
                  className="py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-lg shadow-red-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>바로 구매하기</span>
                </button>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section (Live Supabase DB) */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <span>구매 고객 리뷰</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {reviews.length}개
                </span>
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Supabase 실시간 연동</span>
            </div>

            {/* Write Review Form */}
            <form onSubmit={handleAddReview} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <input
                  type="text"
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  placeholder="닉네임 (예: 피카츄덕후)"
                  required
                  className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-red-500 w-44"
                />

                <div className="flex items-center gap-1 text-xs">
                  <span className="text-slate-500 text-[11px]">별점:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReviewRating(star)}
                      className="p-0.5 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-4 h-4 ${star <= newReviewRating ? 'fill-current' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newReviewContent}
                  onChange={(e) => setNewReviewContent(e.target.value)}
                  placeholder="굿즈 솔직 후기를 남겨주세요!"
                  required
                  className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-red-500"
                />
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>등록</span>
                </button>
              </div>
            </form>

            {/* Reviews List */}
            {loadingReviews ? (
              <div className="text-center py-6 text-xs text-slate-400">
                리뷰를 불러오는 중...
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">
                아직 등록된 리뷰가 없습니다. 첫 번째 리뷰어가 되어보세요!
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 bg-white rounded-xl border border-slate-100 shadow-sm space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{rev.author}</span>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {rev.content}
                    </p>
                    <p className="text-[10px] text-slate-400 pt-0.5">
                      {rev.created_at ? new Date(rev.created_at).toLocaleDateString('ko-KR') : '방금 전'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
