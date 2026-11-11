# ⚡ Pokémon Goods Shop (포켓몬 굿즈샵)
> **Supabase Model Context Protocol (MCP)**를 통해 원격 데이터베이스 스키마 생성, 마이그레이션 적용, 시드 데이터 적재, TypeScript 타입 자동 생성을 완벽히 구현한 실시간 포켓몬 공식 굿즈 스토어입니다.

---

## 🌟 프로젝트 개요 및 Supabase MCP 적용 내역

본 프로젝트는 **Supabase Remote MCP Server** (`https://mcp.supabase.com/mcp`)를 활용하여 구축되었습니다.

### 🛠️ 사용된 Supabase MCP 도구
1. **`apply_migration`**:
   - `categories`, `products`, `orders`, `order_items`, `reviews` 테이블 스키마 생성
   - Row Level Security (RLS) 정책 선언 및 적용
2. **`execute_sql`**:
   - 포켓몬 공식 일러스트 기반 12종 굿즈 데이터 및 초기 고객 리뷰 시드 데이터 적재
   - SQL 무결성 및 인덱스 검증
3. **`generate_typescript_types`**:
   - Supabase 원격 DB로부터 TypeScript 정의 (`src/types/supabase.ts`) 자동 생성
4. **`list_tables`**:
   - 테이블 생성 상태 및 레코드 개수(Row count) 실시간 진단
5. **`get_publishable_keys` & `get_project_url`**:
   - 클라이언트 브라우저 연동을 위한 안전한 API 엔드포인트 및 Anon 키 추출

---

## 🎨 주요 기능

### 1. 포켓몬 센터 온라인 UI & UX
- **히어로 프로모션 배너 (Hero Carousel)**: 잠만보 수면 컬렉션, 뮤 한정판 오르골, 포켓몬 카드 클래식 등 기획전 캐러셀
- **실시간 검색 & 필터**: 포켓몬 이름, 굿즈명, 상세 설명 실시간 검색
- **카테고리 & 포켓몬 속성 필터**:
  - 카테고리: 봉제인형/쿠션, 피규어/디오라마, 문구/팬시, 패션/잡화, 홈/리빙, 카드 게임
  - 포켓몬 타입: 전기, 불꽃, 물, 풀, 에스퍼, 고스트, 노말, 페어리
- **정렬 옵션**: 추천순, 인기순(평점순), 낮은 가격순, 높은 가격순, 신상품순

### 2. 상품 상세 및 실시간 리뷰 (Supabase DB 연동)
- 상품 상세 모달에서 고화질 일러스트, 할인율, 재고 현황, 특장점 확인
- **고객 리뷰 작성 & 실시간 조회**: Supabase `reviews` 테이블과 실시간 연동되어 누구나 리뷰를 등록하고 바로 확인 가능

### 3. 장바구니 & 무료 배송 게이지
- 장바구니 슬라이드오버 드로어
- **50,000원 무료 배송 달성 프로그레스 바** 실시간 표시
- 수량 변경 및 항목 삭제 즉시 반영 (`localStorage` 자동 동기화)

### 4. 주문서 작성 및 결제 시뮬레이션
- 배송지 정보(받는 분, 연락처, 배송지 주소, 배송 메모) 입력
- 간편결제(카카오페이, 네이버페이, 토스페이, 신용카드) 선택
- **Supabase 원격 DB 저장**:
  - `orders` 테이블에 고유 주문 번호(`POKE-YYYYMMDD-XXXX`) 및 결제 내역 저장
  - `order_items` 테이블에 주문 품목 상세 저장
- 결제 완료 시 화려한 폭죽(Confetti) 연출 및 영수증 모달 출력

### 5. 주문 내역 조회 (Order History)
- 헤더의 **주문 내역** 버튼을 클릭하여 Supabase에 저장된 모든 주문을 실시간으로 조회 가능

### 6. Supabase MCP 진단 센터 모달
- 헤더의 **Supabase MCP** 배지 클릭 시 원격 MCP 서버 상태, 프로젝트 정보, 테이블별 실시간 레코드 수(Row count), 사용된 MCP 툴 명세를 한눈에 확인 가능

---

## 🚀 실행 방법

### 로컬 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://127.0.0.1:5173/` 접속

### 프로덕션 빌드
```bash
npm run build
```

### Supabase MCP 스크립트 실행
- DB 마이그레이션 및 시드 데이터 재설정:
  ```bash
  npm run mcp:setup
  ```
- TypeScript 타입 최신화:
  ```bash
  npm run mcp:types
  ```

---

## 📁 디렉터리 구조

```
쇼핑/
├── mcp_config.json              # Supabase MCP 서버 설정
├── package.json                 # 프로젝트 설정 및 의존성
├── vite.config.ts               # Vite 설정
├── tailwind.config.js           # Tailwind 테마 및 포켓몬 컬러 설정
├── .env                         # Supabase 접속 환경 변수
├── scripts/
│   ├── mcp-client.cjs           # Supabase Remote MCP API 클라이언트
│   ├── setup-db.cjs             # MCP apply_migration & execute_sql 실행 스크립트
│   └── generate-types.cjs       # MCP generate_typescript_types 실행 스크립트
└── src/
    ├── index.css                # 글로벌 스타일 및 애니메이션
    ├── main.tsx                 # 진입점
    ├── App.tsx                  # 메인 앱 컴포넌트
    ├── lib/
    │   └── supabase.ts          # Supabase Client 설정
    ├── types/
    │   ├── supabase.ts          # MCP가 자동 생성한 DB 타입 정의
    │   └── store.ts             # 굿즈샵 상태 및 UI 타입
    └── components/
        ├── Navbar.tsx           # 상단 헤더, 검색창, 장바구니/주문조회/MCP 배지
        ├── HeroBanner.tsx       # 기획전 캐러셀 배너
        ├── CategoryBar.tsx      # 카테고리 탭 & 포켓몬 타입 필터
        ├── ProductCard.tsx      # 굿즈 카드 컴포넌트
        ├── ProductModal.tsx     # 상품 상세 & 실시간 리뷰 모달
        ├── CartDrawer.tsx       # 장바구니 드로어 & 무료배송 게이지
        ├── CheckoutModal.tsx    # 주문서 작성 및 Supabase 저장 모달
        ├── OrderSuccessModal.tsx # 결제 완료 영수증 모달
        ├── OrderHistoryModal.tsx # 실시간 주문 내역 조회 모달
        └── McpStatusModal.tsx   # Supabase MCP 진단 및 모니터링 모달
```
