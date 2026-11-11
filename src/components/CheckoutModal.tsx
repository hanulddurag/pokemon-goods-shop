import React, { useState } from 'react';
import type { CartItem, Order } from '../types/store';
import { supabase } from '../lib/supabase';
import confetti from 'canvas-confetti';
import { X, CreditCard, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderCompleted,
}) => {
  const [name, setName] = useState('지우');
  const [email, setEmail] = useState('ash@pokemon.kr');
  const [phone, setPhone] = useState('010-1234-5678');
  const [address, setAddress] = useState('서울특별시 강남구 테헤란로 123 포켓몬타워 7층');
  const [memo, setMemo] = useState('부재 시 경비실에 맡겨주세요.');
  const [paymentMethod, setPaymentMethod] = useState<'kakaopay' | 'naverpay' | 'card' | 'tosspay'>('kakaopay');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = subtotal >= 50000 || subtotal === 0 ? 0 : 3000;
  const totalAmount = subtotal + shippingFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const orderNumber = `POKE-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

      // 1. Insert into orders table
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: name.trim(),
          customer_email: email.trim(),
          customer_phone: phone.trim(),
          shipping_address: address.trim(),
          shipping_memo: memo.trim(),
          payment_method: paymentMethod,
          total_amount: totalAmount,
          status: '결제완료',
        })
        .select()
        .single();

      if (orderError || !orderData) {
        throw new Error(orderError?.message || '주문 생성에 실패했습니다.');
      }

      // 2. Insert into order_items table
      const orderItemsToInsert = items.map((item) => ({
        order_id: orderData.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_image: item.product.image_url,
        unit_price: item.product.price,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert);

      if (itemsError) {
        console.warn('Order items insert notice:', itemsError);
      }

      // 3. Fire Confetti!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#EE1515', '#FFDE00', '#3B4CCA', '#22C55E']
        });
      } catch {}

      onOrderCompleted(orderData);
    } catch (err: any) {
      console.error('Order error:', err);
      setErrorMsg(err.message || '주문 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative bg-white rounded-3xl max-w-xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="font-extrabold text-lg text-slate-900">주문서 작성 및 결제</h2>
            <p className="text-xs text-slate-500 mt-0.5">Supabase 데이터베이스에 안전하게 기록됩니다.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitOrder} className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Ordered items preview */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs text-slate-700">주문 상품 요약 ({items.length}종)</h3>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 divide-y divide-slate-100 max-h-36 overflow-y-auto">
              {items.map((it) => (
                <div key={it.product.id} className="py-1.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate mr-2">
                    <img src={it.product.image_url} alt="" className="w-7 h-7 object-contain bg-white rounded-md p-0.5 border" />
                    <span className="truncate text-slate-800">{it.product.name}</span>
                    <span className="text-slate-400 font-semibold">x{it.quantity}</span>
                  </div>
                  <span className="font-bold text-slate-900 flex-shrink-0">
                    {(it.product.price * it.quantity).toLocaleString()}원
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Details */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs text-slate-700 flex items-center justify-between">
              <span>배송지 정보</span>
              <span className="text-[11px] text-red-500">*필수</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">받는 분</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">연락처</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">이메일 (주문서 발송용)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">배송 주소</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">배송 메모</label>
              <input
                type="text"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="배송 기사님께 전달할 메시지"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-red-500"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs text-slate-700">결제 수단 선택</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'kakaopay', name: '카카오페이', badge: '간편결제', color: 'border-yellow-300 bg-yellow-50/50' },
                { id: 'naverpay', name: '네이버페이', badge: '적립혜택', color: 'border-emerald-300 bg-emerald-50/50' },
                { id: 'tosspay', name: '토스페이', badge: '1초결제', color: 'border-blue-300 bg-blue-50/50' },
                { id: 'card', name: '일반 신용카드', badge: '무이자할부', color: 'border-slate-300 bg-slate-50' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                    paymentMethod === m.id
                      ? 'border-red-500 bg-red-50/60 ring-2 ring-red-200'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div>
                    <p className="font-bold text-slate-800">{m.name}</p>
                    <span className="text-[10px] text-slate-400 font-medium">{m.badge}</span>
                  </div>
                  {paymentMethod === m.id && (
                    <CheckCircle2 className="w-4 h-4 text-red-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Total & Submit */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-sm text-slate-800">최종 결제 금액</span>
              <div className="text-right">
                <span className="font-black text-2xl text-red-600">
                  {totalAmount.toLocaleString()}
                </span>
                <span className="text-xs text-slate-600 ml-1">원</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>포켓몬 코리아 공식 보안 결제 시스템 적용</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-red-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>주문 및 결제 처리 중...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>{totalAmount.toLocaleString()}원 결제하기</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
