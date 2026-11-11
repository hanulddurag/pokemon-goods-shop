import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from './lib/supabase';
import type { Product, Category, CartItem, PokemonType, Order } from './types/store';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryBar } from './components/CategoryBar';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { McpStatusModal } from './components/McpStatusModal';
import { Sparkles, Database, ShoppingBag, ShieldCheck, Heart } from 'lucide-react';

export const App: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState<PokemonType>('전체');
  const [sortBy, setSortBy] = useState('featured');

  // State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('poke_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('poke_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [isMcpModalOpen, setIsMcpModalOpen] = useState(false);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('poke_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('poke_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Initial Load from Supabase
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [catsRes, prodsRes] = await Promise.all([
        supabase.from('categories').select('*').order('display_order', { ascending: true }),
        supabase.from('products').select('*').order('created_at', { ascending: false }),
      ]);

      if (catsRes.data) setCategories(catsRes.data);
      if (prodsRes.data) setProducts(prodsRes.data);
    } catch (err) {
      console.error('Error fetching Supabase data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    setJustAddedId(product.id);
    setTimeout(() => setJustAddedId(null), 1500);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Wishlist toggle
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  };

  // Direct buy from modal
  const handleDirectBuy = (product: Product, quantity: number) => {
    setSelectedProduct(null);
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCheckoutOpen(true);
  };

  // Filter & Sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all' && p.category_id !== selectedCategory) {
          return false;
        }

        // Pokemon Type filter
        if (selectedType !== '전체' && p.pokemon_type !== selectedType) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchEn = p.name_en?.toLowerCase().includes(q);
          const matchPokemon = p.pokemon_name?.toLowerCase().includes(q);
          const matchType = p.pokemon_type?.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          return matchName || matchEn || matchPokemon || matchType || matchDesc;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'featured') {
          return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
        }
        if (sortBy === 'popularity') {
          return (b.rating || 0) - (a.rating || 0);
        }
        if (sortBy === 'price-asc') {
          return a.price - b.price;
        }
        if (sortBy === 'price-desc') {
          return b.price - a.price;
        }
        if (sortBy === 'newest') {
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
        }
        return 0;
      });
  }, [products, selectedCategory, selectedType, searchQuery, sortBy]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC]">
      {/* Navigation */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={() => setIsOrderHistoryOpen(true)}
        onOpenMcpStatus={() => setIsMcpModalOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1 pb-16">
        {/* Hero Carousel */}
        <HeroBanner
          onSelectPokemonFilter={(pokeName) => {
            setSearchQuery(pokeName);
            window.scrollTo({ top: 480, behavior: 'smooth' });
          }}
        />

        {/* Categories & Filter Bar */}
        <CategoryBar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedType={selectedType}
          onSelectType={setSelectedType}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalProductsCount={filteredProducts.length}
        />

        {/* Product Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {loading ? (
            <div className="py-24 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-700">
                Supabase MCP에서 공식 포켓몬 굿즈 데이터를 불러오는 중...
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-24 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                조건에 일치하는 포켓몬 굿즈가 없습니다
              </h3>
              <p className="text-xs text-slate-500">
                검색어나 선택한 필터를 변경해 보세요.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedType('전체');
                }}
                className="mt-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                필터 초기화
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlist.includes(product.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onAddToCart={handleAddToCart}
                  onSelect={setSelectedProduct}
                  isAddedJustNow={justAddedId === product.id}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white text-[10px] font-black">
                P
              </div>
              <span className="font-extrabold text-sm text-white tracking-wider">
                POKÉMON STORE
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              포켓몬스터 공식 라이선스 정품 굿즈 전문 스토어입니다.
              봉제인형, 디오라마 피규어, 카드 게임 및 프리미엄 라이프스타일 굿즈를 만나보세요.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs mb-3">고객센터 안내</h4>
            <p className="font-mono text-sm font-bold text-red-400">1588-0000</p>
            <p className="text-[11px] mt-1">평일 09:00 - 18:00 (주말 및 공휴일 휴무)</p>
            <p className="text-[11px] text-slate-400 mt-1">이메일: support@pokemonstore.kr</p>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs mb-3">인프라 및 기술 스택</h4>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Database className="w-3.5 h-3.5" />
                <span>Supabase Remote MCP Server</span>
              </div>
              <p className="text-slate-400">PostgreSQL 17.11 (ap-northeast-2)</p>
              <p className="text-slate-400">React 18 + TypeScript + Tailwind CSS</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs mb-3">인증 및 보안</h4>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>포켓몬 공식 라이선스 정품 100%</span>
              </div>
              <p className="text-slate-400">안전 결제 에스크로 시스템 적용</p>
              <button
                onClick={() => setIsMcpModalOpen(true)}
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-yellow-300 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                <span>Supabase MCP 진단창 열기</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-slate-800 text-center text-[11px] text-slate-400">
          <p>© 2026 Pokémon. © 1995–2026 Nintendo / Creatures Inc. / GAME FREAK inc.</p>
          <p className="mt-1">Powered by Supabase MCP (Model Context Protocol). All rights reserved.</p>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onDirectBuy={handleDirectBuy}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        onOrderCompleted={(order) => {
          setIsCheckoutOpen(false);
          setCart([]);
          setCompletedOrder(order);
        }}
      />

      <OrderSuccessModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
        onViewOrderHistory={() => setIsOrderHistoryOpen(true)}
      />

      <OrderHistoryModal
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
      />

      <McpStatusModal
        isOpen={isMcpModalOpen}
        onClose={() => setIsMcpModalOpen(false)}
        onRefreshProducts={loadData}
      />
    </div>
  );
};

export default App;
