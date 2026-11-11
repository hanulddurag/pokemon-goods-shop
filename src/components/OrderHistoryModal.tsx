import React, { useState, useEffect } from 'react';
import type { Order, OrderItem } from '../types/store';
import { supabase } from '../lib/supabase';
import { X, Package, RefreshCw, Calendar, Truck, AlertCircle } from 'lucide-react';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OrderWithItems extends Order {
  items?: OrderItem[];
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadOrders();
    }
  }, [isOpen]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data: ordersData, error: ordersErr } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersErr) throw ordersErr;

      if (ordersData && ordersData.length > 0) {
        // Load items for these orders
        const orderIds = ordersData.map((o) => o.id);
        const { data: itemsData } = await supabase
          .from('order_items')
          .select('*')
          .in('order_id', orderIds);

        const merged: OrderWithItems[] = ordersData.map((o) => ({
          ...o,
          items: itemsData ? itemsData.filter((it) => it.order_id === o.id) : [],
        }));
        setOrders(merged);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-red-600" />
            <h2 className="font-extrabold text-base text-slate-900">주문 내역 조회 (Supabase DB)</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadOrders}
              disabled={loading}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
              title="새로고침"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-4">
          {loading ? (
            <div className="py-16 text-center text-xs text-slate-400 space-y-2">
              <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p>주문 내역을 Supabase에서 불러오는 중...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-3">
              <AlertCircle className="w-10 h-10 mx-auto text-slate-300" />
              <div>
                <p className="font-bold text-sm text-slate-700">아직 주문 내역이 없습니다</p>
                <p className="text-xs text-slate-400 mt-0.5">원하는 포켓몬 굿즈를 주문해 보세요!</p>
              </div>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200 text-xs">
                  <div className="space-y-0.5">
                    <span className="font-mono font-bold text-slate-900">
                      {order.order_number}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Calendar className="w-3 h-3" />
                      <span>{order.created_at ? new Date(order.created_at).toLocaleString('ko-KR') : '-'}</span>
                    </div>
                  </div>

                  <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full text-[11px] border border-emerald-200 flex items-center gap-1">
                    <Truck className="w-3 h-3" />
                    {order.status || '결제완료'}
                  </span>
                </div>

                {/* Items */}
                {order.items && order.items.length > 0 && (
                  <div className="space-y-2">
                    {order.items.map((it) => (
                      <div key={it.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 truncate mr-2">
                          {it.product_image && (
                            <img src={it.product_image} alt="" className="w-8 h-8 object-contain bg-white rounded border p-0.5" />
                          )}
                          <span className="font-medium text-slate-800 truncate">{it.product_name}</span>
                          <span className="text-slate-400 font-bold">x{it.quantity}</span>
                        </div>
                        <span className="font-bold text-slate-900 flex-shrink-0">
                          {(it.unit_price * it.quantity).toLocaleString()}원
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    받는 분: <strong>{order.customer_name}</strong> ({order.shipping_address})
                  </span>
                  <div className="text-right">
                    <span className="font-bold text-slate-700 mr-1.5">총 결제</span>
                    <span className="font-black text-sm text-red-600">
                      {order.total_amount.toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
