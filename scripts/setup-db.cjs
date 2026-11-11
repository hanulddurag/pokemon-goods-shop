const { callMcpTool } = require('./mcp-client.cjs');

async function setupDatabase() {
  console.log('🚀 Starting Supabase Database Setup via MCP...');

  const migrationSql = `
-- Drop existing tables if clean start is preferred
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;

-- Categories table
CREATE TABLE public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_en TEXT,
    icon TEXT,
    display_order INT DEFAULT 0
);

-- Products table
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    name_en TEXT,
    pokemon_name TEXT,
    pokemon_type TEXT,
    price INT NOT NULL,
    original_price INT,
    stock INT DEFAULT 100,
    rating NUMERIC(3, 2) DEFAULT 4.9,
    review_count INT DEFAULT 0,
    badge TEXT,
    image_url TEXT NOT NULL,
    gallery TEXT[] DEFAULT '{}',
    description TEXT,
    features TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Orders table
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_memo TEXT,
    payment_method TEXT DEFAULT 'kakaopay',
    total_amount INT NOT NULL,
    status TEXT DEFAULT '결제완료',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Order Items table
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_image TEXT,
    unit_price INT NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Reviews table
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    author TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Policies for public access (anon & authenticated)
CREATE POLICY "Public read categories" ON public.categories FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public read products" ON public.products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public insert products" ON public.products FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public update products" ON public.products FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Public delete products" ON public.products FOR DELETE TO anon, authenticated USING (true);

CREATE POLICY "Public read orders" ON public.orders FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Public read order_items" ON public.order_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public insert order_items" ON public.order_items FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public insert reviews" ON public.reviews FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Seed Categories
INSERT INTO public.categories (id, name, name_en, icon, display_order) VALUES
('plush', '봉제인형 / 쿠션', 'Plush & Cushions', '🧸', 1),
('figures', '피규어 / 디오라마', 'Figures & Dioramas', '✨', 2),
('stationery', '문구 / 팬시', 'Stationery', '✏️', 3),
('fashion', '패션 / 악세서리', 'Fashion & Acc', '🧢', 4),
('living', '리빙 / 인테리어', 'Living & Home', '🛋️', 5),
('cards', '카드 게임 / 수집품', 'TCG & Collectibles', '🃏', 6);
  `;

  console.log('📦 Applying migration via MCP apply_migration tool...');
  const migResult = await callMcpTool('apply_migration', {
    name: 'create_pokemon_store_schema',
    query: migrationSql
  });
  console.log('✅ Migration applied successfully:', migResult);

  // Now seed products
  const seedProductsSql = `
INSERT INTO public.products (category_id, name, name_en, pokemon_name, pokemon_type, price, original_price, stock, rating, review_count, badge, image_url, description, features, is_featured)
VALUES
(
  'plush',
  '대형 잠자는 피카츄 말랑 봉제인형 (65cm)',
  'Giant Sleeping Pikachu Plush 65cm',
  '피카츄',
  '전기',
  59000,
  69000,
  35,
  4.95,
  128,
  'BEST',
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
  '폭신폭신 극세사 원단으로 제작된 초대형 피카츄 수면 인형입니다. 안고 자기 딱 좋은 사이즈!',
  ARRAY['초극세사 벨벳 원단 사용', 'KC 인증 완료 무독성 솜', '길이 65cm 대형 사이즈', '포켓몬 공식 라이선스 홀로그램'],
  true
),
(
  'plush',
  '말랑 쫀득 메타몽 페이스 바디 필로우',
  'Squishy Ditto Body Pillow Cushion',
  '메타몽',
  '노말',
  42000,
  48000,
  50,
  4.98,
  95,
  'HOT',
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png',
  '특수 메모리폼 충전재로 만들어져 누르면 사르르 복원되는 마성의 메타몽 쿠션입니다.',
  ARRAY['스트레스 해소용 말랑 텍스처', '세탁 가능한 분리형 커버', '사이즈: 50x45cm'],
  true
),
(
  'figures',
  '환상의 포켓몬 뮤 크리스탈 오르골 피규어',
  'Mythical Mew Crystal Music Box Figure',
  '뮤',
  '에스퍼',
  89000,
  99000,
  15,
  5.00,
  42,
  'LIMITED',
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png',
  '18노트 일본 산쿄 무브먼트가 탑재되어 오르골 멜로디와 함께 은은한 오로라 LED가 빛나는 한정판 뮤 디오라마.',
  ARRAY['산쿄 프리미엄 18노트 무브먼트', 'USB C타입 충전 내장 배터리', '수공예 크리스탈 글래스 돔', '시리얼 넘버 보증서 포함'],
  true
),
(
  'figures',
  '팬텀 쉐도우 볼 야광 디오라마 피규어 (LED)',
  'Gengar Shadow Ball Glow Diorama Figure',
  '팬텀',
  '고스트',
  75000,
  82000,
  24,
  4.92,
  67,
  'HOT',
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png',
  '어둠 속에서 보랏빛으로 빛나는 팬텀의 섀도볼 이펙트 파츠와 장난기 넘치는 표정이 완벽하게 재현된 역작!',
  ARRAY['3단 터치 밝기 조절 LED 베이스', '클리어 파츠 그라데이션 도색', '높이 22cm 스케일'],
  true
),
(
  'living',
  '잠만보 침대 빈백 소파 (초대형 150cm)',
  'Giant Snorlax Bean Bag Chair 150cm',
  '잠만보',
  '노말',
  149000,
  179000,
  8,
  4.96,
  54,
  'BEST',
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png',
  '누구든 눕는 순간 꿀잠에 빠져드는 마성의 잠만보 빈백 소파! 거실 인테리어 끝판왕.',
  ARRAY['인체공학적 마이크로 EPP 비즈 충전', '생활 방수 및 오염 방지 코팅', '하중 150kg까지 지탱'],
  true
),
(
  'fashion',
  '이브이 프렌즈 자수 오버핏 후드 티셔츠',
  'Eevee & Evolutions Embroidered Hoodie',
  '이브이',
  '노말',
  68000,
  75000,
  40,
  4.88,
  83,
  'NEW',
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png',
  '고밀도 헤비웨이트 코튼 100% 원단에 가슴 부분 섬세한 이브이 실사 자수가 포인트인 데일리 후드티.',
  ARRAY['헤비 텐타 덤블 코튼 850g', '고정밀 12만 침 침수 자수', '유니섹스 오버사이즈 핏 (M, L, XL)'],
  false
),
(
  'figures',
  '리자몽 거다이맥스 불꽃 이펙트 스태츄',
  'Gigantamax Charizard Flame Effect Statue',
  '리자몽',
  '불꽃',
  125000,
  138000,
  12,
  4.97,
  38,
  'LIMITED',
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
  '압도적인 날개 폭과 불꽃 날개 투명 이펙트가 장관을 이루는 하이엔드 수집가용 리자몽 스태츄.',
  ARRAY['날개 폭 35cm 대형 스케일', '반투명 레진 불꽃 라이팅 파츠', '전용 콜렉터스 패키지 박스'],
  true
),
(
  'cards',
  '포켓몬 카드 게임 클래식 프리미엄 기프트 박스',
  'Pokemon Card Game Classic Premium Deck Box',
  '피카츄',
  '전기',
  98000,
  110000,
  20,
  4.99,
  112,
  'HOT',
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
  '1세대 리자몽, 거북왕, 이상해꽃의 홀로그램 카드가 모두 포함된 영구 소장 가치 100% 한정판 세트.',
  ARRAY['특수 레어 홀로그램 카드 60장 3덱', '알루미늄 데미지 카운터 콘', '고급 가죽 덱 케이스 & 플레이매트'],
  true
),
(
  'stationery',
  '푸린 수면 사운드 무드등 알람시계',
  'Jigglypuff Lullaby Glow Alarm Clock',
  '푸린',
  '페어리',
  38000,
  45000,
  45,
  4.85,
  61,
  'NEW',
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png',
  '푸린의 귀여운 자장가 멜로디와 함께 따뜻한 웜톤 라이트로 아침을 깨워주는 디지털 스마트 탁상시계.',
  ARRAY['푸린 오리지널 사운드 3종 수록', '터치식 조도 조절 무드등', '온/습도 표시 LCD 디스플레이'],
  false
),
(
  'stationery',
  '1세대 스타팅 관동지방 체육관 배지 8종 세트',
  'Kanto Gym Badges 8-Piece Collector Set',
  '이상해씨',
  '풀',
  34000,
  39000,
  60,
  4.94,
  89,
  'BEST',
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
  '회색체육관부터 상록체육관까지 관동 리그를 정복한 챔피언만을 위한 메탈 합금 도금 배지 컬렉션.',
  ARRAY['황동 합금 에나멜 칠 보석 마감', '벨벳 수납 마그네틱 하드케이스', '체육관 관장 공인 챔피언 보증서'],
  false
),
(
  'fashion',
  '따라큐 고스트 타입 캔버스 미니 토트백',
  'Mimikyu Ghost Type Mini Canvas Tote',
  '따라큐',
  '고스트',
  28000,
  33000,
  70,
  4.91,
  74,
  'NEW',
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/778.png',
  '탈을 쓴 따라큐의 귀여운 일러스트가 프린팅된 튼튼한 16수 캔버스 크로스 겸용 미니백.',
  ARRAY['내구성 강한 고밀도 캔버스 패브릭', '내부 텀블러 홀더 및 포켓', '탈부착 가능한 숄더 스트랩 포함'],
  false
),
(
  'living',
  '꼬부기 퐁당 세라믹 머그컵 & 코스터 세트',
  'Squirtle Splash Ceramic Mug & Coaster',
  '꼬부기',
  '물',
  24000,
  28000,
  85,
  4.89,
  93,
  'BEST',
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png',
  '손잡이에 매달린 입체 꼬부기 피규어가 매력적인 핸드메이드 도자기 머그컵과 물결 실리콘 코스터.',
  ARRAY['전자레인지 및 식기세척기 사용 가능', '고온 소성 친환경 세라믹 (420ml)', '미끄럼 방지 실리콘 코스터 증정'],
  false
);
  `;

  console.log('🌱 Seeding products via MCP execute_sql tool...');
  const seedResult = await callMcpTool('execute_sql', {
    query: seedProductsSql
  });
  console.log('✅ Products seeded successfully:', seedResult);

  // Now seed a sample review
  const seedReviewSql = `
INSERT INTO public.reviews (product_id, author, rating, content)
SELECT id, '지우 (태초마을)', 5, '피카츄 인형 정말 귀엽고 퀄리티 미쳤습니다! 잠잘 때 필수템이에요!'
FROM public.products WHERE pokemon_name = '피카츄' LIMIT 1;

INSERT INTO public.reviews (product_id, author, rating, content)
SELECT id, '이슬이 (블루시티)', 5, '꼬부기 머그컵 너무 깜찍해요~ 매일 아침 차 마실 때 행복합니다.'
FROM public.products WHERE pokemon_name = '꼬부기' LIMIT 1;

INSERT INTO public.reviews (product_id, author, rating, content)
SELECT id, '웅이 (회색도시)', 5, '잠만보 빈백 앉는 순간 바로 잠들었어요 ㅋㅋㅋ 강추합니다!'
FROM public.products WHERE pokemon_name = '잠만보' LIMIT 1;
  `;
  await callMcpTool('execute_sql', { query: seedReviewSql });
  console.log('⭐ Sample reviews seeded.');

  // Verify tables
  const tables = await callMcpTool('list_tables');
  console.log('📊 Active tables in Supabase:', tables);

  console.log('🎉 Setup Completed Successfully!');
}

setupDatabase().catch(err => {
  console.error('❌ Error during setup:', err);
  process.exit(1);
});
