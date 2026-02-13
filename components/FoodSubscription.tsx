
import React, { useState, useMemo } from 'react';
import { FunctionalFood, SleepLog } from '../types';
import { CheckBadgeIcon, SparklesIcon, GiftIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

const mockFoods: FunctionalFood[] = [
  {
    id: '1',
    name: '소프누스 딥슬립 젤리',
    description: 'L-테아닌과 타트체리의 완벽한 조합으로 더 빠르게 깊은 잠에 들도록 돕습니다.',
    benefits: ['입면 시간 단축', 'REM 수면 사이클 지원', '멜라토닌 무첨가'],
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=200&h=200',
    price: 24000,
    ingredients: ['L-테아닌', '타트체리', '마그네슘'],
    type: 'deep_sleep'
  },
  {
    id: '2',
    name: '나이틀리 캄 티 추출물',
    description: '카모마일과 발레리안 루트의 고농축 액상 추출물로 심신의 안정을 돕습니다.',
    benefits: ['스트레스 완화', '근육 긴장 해제', '심신 진정'],
    imageUrl: 'https://images.unsplash.com/photo-1544787210-2213d84ad960?auto=format&fit=crop&q=80&w=200&h=200',
    price: 18000,
    ingredients: ['카모마일', '발레리안 루트', '라벤더'],
    type: 'fast_sleep'
  },
  {
    id: '3',
    name: '회복을 위한 미네랄 구미',
    description: '아연과 마그네슘이 자는 동안 신체 회복을 돕고 아침을 상쾌하게 만듭니다.',
    benefits: ['신체 피로 회복', '호르몬 밸런스', '상쾌한 기상'],
    imageUrl: 'https://images.unsplash.com/photo-1559114062-10903328e932?auto=format&fit=crop&q=80&w=200&h=200',
    price: 21000,
    ingredients: ['글리신 마그네슘', '아연', '비타민 B6'],
    type: 'recovery'
  }
];

const FoodSubscription: React.FC<{ logs: SleepLog[] }> = ({ logs }) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  // 30일 데이터 분석 로직
  const analysis = useMemo(() => {
    if (logs.length < 30) return null;

    const avgDuration = logs.reduce((acc, log) => acc + (log.duration || 0), 0) / logs.length;
    const avgQuality = logs.reduce((acc, log) => acc + log.quality, 0) / logs.length;

    let bestType: 'deep_sleep' | 'fast_sleep' | 'recovery' = 'recovery';
    let reason = "";
    let summary = "";

    if (avgDuration < 6) {
      bestType = 'fast_sleep';
      summary = "수면 시간 부족형";
      reason = `평균 수면 시간이 ${avgDuration.toFixed(1)}시간으로 권장 시간보다 부족합니다. 빠른 입면을 돕는 솔루션이 필요합니다.`;
    } else if (avgQuality < 75) {
      bestType = 'deep_sleep';
      summary = "수면 질 저하형";
      reason = `수면 효율 점수가 ${Math.round(avgQuality)}점으로 낮게 측정되었습니다. 깊은 수면(Non-REM) 비중을 높이는 것이 중요합니다.`;
    } else {
      bestType = 'recovery';
      summary = "신체 피로 누적형";
      reason = "수면 패턴은 안정적이나, 기상 시 피로도가 확인됩니다. 자는 동안의 신체 회복력을 극대화하는 미네랄 보충을 추천합니다.";
    }

    return { bestType, reason, summary, avgDuration, avgQuality };
  }, [logs]);

  return (
    <div className="p-6 space-y-8 pb-32 text-slate-100">
      <header className="space-y-1">
        <div className="flex items-center gap-2 text-indigo-400">
          <SparklesIcon className="w-5 h-5" />
          <span className="text-xs font-bold tracking-widest uppercase">데이터 기반 맞춤 솔루션</span>
        </div>
        <h2 className="text-2xl font-bold">수면 맞춤 영양 케어</h2>
        
        {analysis ? (
          <div className="mt-6 p-5 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-3xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="px-2 py-0.5 bg-indigo-500 rounded text-[10px] font-bold text-white uppercase">Analysis Complete</div>
                <h4 className="text-sm font-bold text-indigo-100">{analysis.summary}</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {analysis.reason}
              </p>
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">평균 시간</p>
                  <p className="text-lg font-bold text-white">{analysis.avgDuration.toFixed(1)}h</p>
                </div>
                <div className="w-px h-8 bg-slate-700 self-center"></div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">평균 점수</p>
                  <p className="text-lg font-bold text-indigo-400">{Math.round(analysis.avgQuality)}점</p>
                </div>
              </div>
            </div>
            <SparklesIcon className="absolute -right-4 -bottom-4 w-24 h-24 text-indigo-500/10 rotate-12" />
          </div>
        ) : (
          <div className="mt-4 p-4 bg-slate-800/40 border border-slate-700 rounded-2xl flex items-start gap-3">
            <InformationCircleIcon className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-400 leading-normal">
              정밀 분석 리포트를 생성하려면 <b>{30 - logs.length}일치</b>의 데이터가 더 필요합니다. 현재는 일반적인 인기 제품을 보여드립니다.
            </p>
          </div>
        )}
      </header>

      <div className="space-y-6">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">추천 제품 리스트</h3>
        {mockFoods.map((food) => {
          const isBest = analysis?.bestType === food.type;
          
          return (
            <div 
              key={food.id}
              className={`group relative overflow-hidden rounded-3xl border transition-all duration-300 ${
                selectedPlan === food.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'
              } ${isBest ? 'ring-2 ring-indigo-500/50 ring-offset-2 ring-offset-slate-900' : ''}`}
              onClick={() => setSelectedPlan(food.id)}
            >
              {isBest && (
                <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-black px-4 py-1 rounded-bl-2xl z-10 flex items-center gap-1 shadow-lg">
                  <SparklesIcon className="w-3 h-3" /> BEST MATCH
                </div>
              )}
              
              <div className="flex gap-4 p-4">
                <img src={food.imageUrl} alt={food.name} className="w-24 h-24 rounded-2xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-500" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-100 truncate">{food.name}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{food.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {food.ingredients.map(ing => (
                      <span key={ing} className="px-1.5 py-0.5 bg-slate-800 rounded text-[9px] text-slate-400 border border-slate-700">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="px-4 pb-4">
                <div className="space-y-1.5 mb-4 bg-slate-900/40 p-3 rounded-xl border border-slate-800/50">
                  {food.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300">
                      <CheckBadgeIcon className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">정기 구독가</span>
                    <span className="text-lg font-bold">₩{food.price.toLocaleString()}</span>
                  </div>
                  <button 
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all transform active:scale-95 ${
                      selectedPlan === food.id 
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-900/40' 
                      : 'bg-slate-700 text-slate-300 group-hover:bg-indigo-600/20 group-hover:text-indigo-300'
                    }`}
                  >
                    {selectedPlan === food.id ? '선택 완료' : '구독 신청'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 shadow-2xl shadow-indigo-900/40 relative overflow-hidden group">
        <div className="relative z-10">
          <h4 className="font-bold text-white text-lg mb-1 flex items-center gap-2">
            <MoonIcon className="w-5 h-5" /> 솜누스 프라임 멤버십
          </h4>
          <p className="text-xs text-indigo-100 mb-6 opacity-80 leading-relaxed">
            30일 정밀 분석 리포트 + 맞춤형 건기식 3종 키트 정기 배송 서비스를 시작해보세요.
          </p>
          <button className="w-full bg-white text-indigo-700 font-black py-3.5 rounded-2xl text-sm transition-all hover:bg-indigo-50 active:scale-95 shadow-xl">
            무료 체험 시작하기
          </button>
        </div>
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
      </div>
    </div>
  );
};

const MoonIcon = ({ className }: { className?: string }) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
);

export default FoodSubscription;
