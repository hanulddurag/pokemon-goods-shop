import React, { useState, useEffect } from 'react';
import { supabase, SUPABASE_PROJECT_ID, SUPABASE_URL } from '../lib/supabase';
import { X, Database, Terminal, CheckCircle2, RefreshCw, Cpu, Layers, ShieldCheck } from 'lucide-react';

interface McpStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshProducts: () => void;
}

interface TableStats {
  categories: number;
  products: number;
  orders: number;
  order_items: number;
  reviews: number;
}

export const McpStatusModal: React.FC<McpStatusModalProps> = ({
  isOpen,
  onClose,
  onRefreshProducts,
}) => {
  const [stats, setStats] = useState<TableStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'tools' | 'schema'>('status');

  useEffect(() => {
    if (isOpen) {
      loadStats();
    }
  }, [isOpen]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [
        { count: catCount },
        { count: prodCount },
        { count: ordCount },
        { count: itemCount },
        { count: revCount },
      ] = await Promise.all([
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('order_items').select('*', { count: 'exact', head: true }),
        supabase.from('reviews').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        categories: catCount || 0,
        products: prodCount || 0,
        orders: ordCount || 0,
        order_items: itemCount || 0,
        reviews: revCount || 0,
      });
    } catch (err) {
      console.error('Error fetching MCP stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base">Supabase MCP 통합 센터</h2>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-700/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  MCP 활성화됨
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Model Context Protocol v2024-11-05</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600 px-6">
          <button
            onClick={() => setActiveTab('status')}
            className={`py-3 px-4 border-b-2 transition-all ${
              activeTab === 'status'
                ? 'border-red-600 text-red-600 font-extrabold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            서버 상태 및 데이터 통계
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`py-3 px-4 border-b-2 transition-all ${
              activeTab === 'tools'
                ? 'border-red-600 text-red-600 font-extrabold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            적용된 MCP 도구 목록
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`py-3 px-4 border-b-2 transition-all ${
              activeTab === 'schema'
                ? 'border-red-600 text-red-600 font-extrabold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            DB 스키마 구조
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'status' && (
            <div className="space-y-6">
              {/* Connection Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[11px] text-slate-400 font-semibold">Supabase Remote MCP Endpoint</span>
                  <p className="font-mono font-bold text-slate-800 break-all text-[11px]">
                    https://mcp.supabase.com/mcp
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[11px] text-slate-400 font-semibold">연결된 Supabase 프로젝트 ID</span>
                  <p className="font-mono font-bold text-slate-800 text-[11px]">
                    {SUPABASE_PROJECT_ID} (Seoul, ap-northeast-2)
                  </p>
                </div>
              </div>

              {/* Table Records Count */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs text-slate-700 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-red-600" />
                    <span>실시간 Supabase 테이블 레코드 수</span>
                  </h3>
                  <button
                    onClick={loadStats}
                    disabled={loading}
                    className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-red-600 font-semibold"
                  >
                    <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                    <span>새로고침</span>
                  </button>
                </div>

                {stats ? (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {[
                      { name: '카테고리', table: 'categories', count: stats.categories, color: 'text-blue-600' },
                      { name: '포켓몬 굿즈', table: 'products', count: stats.products, color: 'text-red-600' },
                      { name: '주문 내역', table: 'orders', count: stats.orders, color: 'text-amber-600' },
                      { name: '주문 상세 품목', table: 'order_items', count: stats.order_items, color: 'text-purple-600' },
                      { name: '고객 리뷰', table: 'reviews', count: stats.reviews, color: 'text-emerald-600' },
                    ].map((t) => (
                      <div key={t.table} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold block">{t.name}</span>
                        <span className={`text-xl font-black ${t.color}`}>{t.count}</span>
                        <span className="text-[9px] text-slate-400 block font-mono">public.{t.table}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400">통계 불러오는 중...</div>
                )}
              </div>

              {/* RLS Security */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <h4 className="font-bold text-emerald-900">Row Level Security (RLS) 보호 완료</h4>
                  <p className="text-emerald-700 leading-relaxed">
                    모든 테이블에 RLS 정책이 MCP `apply_migration`을 통해 선언적으로 적용되어 공개 접근 정책 및 주문 생성 무결성이 보장됩니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                이번 포켓몬 굿즈샵 구축에 사용된 Supabase Remote MCP 핵심 도구입니다:
              </p>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
                {[
                  {
                    name: 'apply_migration',
                    desc: 'categories, products, orders, order_items, reviews 테이블 및 RLS 보안 정책 일괄 마이그레이션 생성',
                    badge: 'DDL',
                  },
                  {
                    name: 'execute_sql',
                    desc: '포켓몬 공식 굿즈 12종 및 초기 고객 리뷰 시드 데이터 직접 삽입 및 무결성 검증',
                    badge: 'SQL',
                  },
                  {
                    name: 'generate_typescript_types',
                    desc: 'Supabase 원격 스키마에서 직접 TypeScript Type 정의 파일(src/types/supabase.ts) 자동 추출',
                    badge: 'Types',
                  },
                  {
                    name: 'list_tables',
                    desc: '생성된 데이터베이스 테이블 및 행(row) 수 실시간 상태 진단',
                    badge: 'Schema',
                  },
                  {
                    name: 'get_publishable_keys',
                    desc: '클라이언트 연동을 위한 안전한 Supabase Anon/Publishable API 키 추출',
                    badge: 'Auth',
                  },
                ].map((tool) => (
                  <div key={tool.name} className="p-3.5 flex items-start justify-between gap-3 bg-white">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-3.5 h-3.5 text-slate-500" />
                        <span className="font-mono font-bold text-xs text-slate-900">{tool.name}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{tool.desc}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex-shrink-0">
                      {tool.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-3">
              <h3 className="font-bold text-xs text-slate-700">ERD & 테이블 명세</h3>
              <div className="p-4 bg-slate-900 text-slate-200 rounded-2xl font-mono text-[11px] leading-relaxed overflow-x-auto space-y-3">
                <div className="text-emerald-400">-- 1. categories (id PK, name, name_en, icon, display_order)</div>
                <div className="text-yellow-400">-- 2. products (id UUID PK, category_id FK, name, pokemon_type, price, stock, badge, image_url, ...)</div>
                <div className="text-blue-400">-- 3. orders (id UUID PK, order_number UNIQUE, customer_name, total_amount, status, ...)</div>
                <div className="text-purple-400">-- 4. order_items (id UUID PK, order_id FK, product_id FK, unit_price, quantity)</div>
                <div className="text-pink-400">-- 5. reviews (id UUID PK, product_id FK, author, rating, content)</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
