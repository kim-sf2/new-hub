
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SleepLog } from '../types';
import { SparklesIcon, CalendarIcon } from '@heroicons/react/24/solid';

const SleepDashboard: React.FC<{ logs: SleepLog[] }> = ({ logs }) => {
  const chartData = [...logs].reverse().slice(-7).map(log => ({
    date: new Date(log.startTime).toLocaleDateString('ko-KR', { weekday: 'short' }),
    duration: log.duration,
    quality: log.quality
  }));

  const avgQuality = logs.length > 0 
    ? Math.round(logs.reduce((acc, curr) => acc + curr.quality, 0) / logs.length)
    : 0;
  
  const avgDuration = logs.length > 0
    ? (logs.reduce((acc, curr) => acc + (curr.duration || 0), 0) / logs.length).toFixed(1)
    : "0.0";

  return (
    <div className="p-6 space-y-6">
      {logs.length >= 30 ? (
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 rounded-3xl shadow-lg border border-indigo-400/30">
          <div className="flex items-center gap-3 mb-2">
            <SparklesIcon className="w-6 h-6 text-yellow-300" />
            <h3 className="font-bold text-white text-lg">30일 수면 완성!</h3>
          </div>
          <p className="text-sm text-indigo-100 mb-4">
            한 달간의 데이터를 통해 당신의 수면 지도를 완성했습니다. 최적의 건기식 조합이 준비되었습니다.
          </p>
          <button className="w-full py-2.5 bg-white text-indigo-600 text-sm font-bold rounded-xl shadow-md">
            분석 리포트 읽기
          </button>
        </section>
      ) : (
        <section className="bg-slate-800/50 p-5 rounded-3xl border border-slate-700/50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-slate-300">데이터 수집 중</h3>
            <span className="text-xs text-indigo-400 font-bold">{Math.round((logs.length / 30) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${(logs.length / 30) * 100}%` }}></div>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 text-center">30일간의 기록이 모이면 정밀 진단이 가능합니다.</p>
        </section>
      )}

      <section>
        <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">최근 수면 경향</h2>
        <div className="flex justify-between items-end mb-6">
          <div className="flex flex-col">
            <span className="text-4xl font-bold tracking-tighter">{avgDuration}</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase">평균 수면 시간 (h)</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-emerald-400">{avgQuality}점</span>
            <p className="text-[10px] text-slate-500 font-bold uppercase">수면 품질 지수</p>
          </div>
        </div>
        
        <div className="h-56 w-full bg-slate-800/30 rounded-3xl p-4 border border-slate-800">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorQual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="quality" stroke="#818cf8" strokeWidth={3} fill="url(#colorQual)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-2">
              <CalendarIcon className="w-8 h-8 opacity-20" />
              <p className="text-xs">기록된 수면 데이터가 없습니다.</p>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">최근 로그</h2>
        <div className="space-y-2">
          {logs.slice(0, 3).map(log => (
            <div key={log.id} className="bg-slate-800/40 p-3 rounded-2xl flex justify-between items-center border border-slate-800/50">
              <div>
                <p className="text-xs font-bold">{new Date(log.startTime).toLocaleDateString()} 취침</p>
                <p className="text-[10px] text-slate-500">{log.duration}시간 수면</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-indigo-300">{log.quality}점</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SleepDashboard;
