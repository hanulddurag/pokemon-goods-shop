import React, { useState } from 'react';
import type { Order } from '../types/store';
import { CheckCircle2, Copy, Check, Package, ArrowRight } from 'lucide-react';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onViewOrderHistory: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onViewOrderHistory,
}) => {
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(order.order_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden text-center p-6 sm:p-8 space-y-6">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl font-black text-slate-900">주문이 성공적으로 완료되었습니다!</h2>
          <p className="text-xs text-slate-500">
            {order.customer_name} 트레이너님께 감사드립니다. 소중히 포장하여 안전하게 발송해 드리겠습니다.
          </p>
        </div>

        {/* Order Receipt Box */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2.5 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-500">주문 번호</span>
            <div className="flex items-center gap-1 font-mono font-bold text-slate-800">
              <span>{order.order_number}</span>
              <button
                onClick={handleCopyOrderNumber}
                className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 transition-colors"
                title="복사"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">주문 상태</span>
            <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[11px]">
              {order.status || '결제완료'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">받는 분</span>
            <span className="font-semibold text-slate-800">{order.customer_name}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">배송 주소</span>
            <span className="font-medium text-slate-700 text-right max-w-[200px] truncate">
              {order.shipping_address}
            </span>
          </div>

          <div className="flex justify-between pt-2 border-t border-slate-200 items-baseline">
            <span className="font-bold text-slate-700">총 결제금액</span>
            <span className="font-black text-base text-red-600">
              {order.total_amount.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={() => {
              onClose();
              onViewOrderHistory();
            }}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Package className="w-4 h-4" />
            <span>내 주문 내역 확인하기</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1"
          >
            <span>쇼핑 계속하기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
