import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

interface Slide {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  highlight: string;
  bgGradient: string;
  image: string;
  accentColor: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    tag: 'LIMITED SPECIAL',
    title: '포켓몬 센터 2026 수면 컬렉션',
    subtitle: '눕는 순간 꿀잠 보장! 초대형 잠만보 빈백 & 잠자는 피카츄 인형',
    highlight: '최대 20% 할인 + 한정판 스티커 증정',
    bgGradient: 'from-blue-900 via-indigo-900 to-slate-900',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png',
    accentColor: 'text-amber-300'
  },
  {
    id: 2,
    tag: 'NEW ARRIVAL',
    title: '환상의 포켓몬 뮤 크리스탈 오르골',
    subtitle: '산쿄 18노트 멜로디와 은은한 오로라 LED 빛의 환상적인 하모니',
    highlight: '수량 한정 50점 전용 넘버링 보증서 동봉',
    bgGradient: 'from-purple-900 via-fuchsia-900 to-pink-950',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png',
    accentColor: 'text-pink-300'
  },
  {
    id: 3,
    tag: 'BEST COLLECTOR',
    title: '포켓몬 카드 게임 클래식 컬렉션',
    subtitle: '1세대 리자몽·거북왕·이상해꽃 홀로그램 카드 프리미엄 덱 박스',
    highlight: '초판 한정 알루미늄 카운터 & 가죽 케이스 포함',
    bgGradient: 'from-red-950 via-amber-950 to-orange-950',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
    accentColor: 'text-yellow-400'
  }
];

interface HeroBannerProps {
  onSelectPokemonFilter?: (pokemonName: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onSelectPokemonFilter }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current];

  return (
    <div className="relative overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-6 shadow-2xl">
      <div className={`relative min-h-[340px] sm:min-h-[380px] bg-gradient-to-r ${slide.bgGradient} transition-colors duration-700 flex items-center`}>
        {/* Background decorative circles & pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full">
          {/* Text Content */}
          <div className="md:col-span-7 text-white space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>{slide.tag}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {slide.title}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              {slide.subtitle}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <span className={`text-xs sm:text-sm font-semibold ${slide.accentColor} flex items-center gap-1.5`}>
                ✨ {slide.highlight}
              </span>
            </div>

            <div className="pt-3 flex items-center gap-3">
              <button
                onClick={() => {
                  const target = current === 0 ? '잠만보' : current === 1 ? '뮤' : '리자몽';
                  onSelectPokemonFilter?.(target);
                }}
                className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95 group"
              >
                <span>기획전 상품 보기</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Featured Image */}
          <div className="md:col-span-5 flex justify-center items-center relative">
            <div className="relative w-60 h-60 sm:w-72 sm:h-72">
              <div className="absolute inset-0 bg-white/10 rounded-full filter blur-2xl animate-pulse"></div>
              <img
                src={slide.image}
                alt={slide.title}
                className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Carousel Nav Buttons */}
        <button
          onClick={() => setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrent((prev) => (prev + 1) % SLIDES.length)}
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-all"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                current === idx ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
