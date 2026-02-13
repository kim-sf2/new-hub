
import React, { useState, useEffect } from 'react';
import { PlayIcon, PauseIcon, SpeakerWaveIcon, MoonIcon, FireIcon, CloudIcon } from '@heroicons/react/24/solid';

const soundTracks = [
  { id: '1', name: '장작 타는 소리', icon: <FireIcon className="w-6 h-6" />, type: '자연' },
  { id: '2', name: '깊은 바닷속', icon: <SpeakerWaveIcon className="w-6 h-6" />, type: '물소리' },
  { id: '3', name: '여름밤 빗소리', icon: <CloudIcon className="w-6 h-6" />, type: '날씨' },
  { id: '4', name: '화이트 노이즈', icon: <MoonIcon className="w-6 h-6" />, type: '합성' },
];

const SleepRoutine: React.FC<{ isSleeping: boolean }> = ({ isSleeping }) => {
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [timer, setTimer] = useState(600); // 10분

  useEffect(() => {
    if (isSleeping) {
      setIsPlaying('1'); // 수면 시작 시 첫 번째 트랙 자동 선택 시뮬레이션
    } else {
      setIsPlaying(null);
    }
  }, [isSleeping]);

  useEffect(() => {
    let interval: any;
    if (isPlaying && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 space-y-8">
      <header className="text-center">
        <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all duration-1000 ${isSleeping ? 'bg-indigo-500 animate-pulse scale-110 shadow-2xl shadow-indigo-500/50' : 'bg-slate-800'}`}>
          <MoonIcon className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold">{isSleeping ? "숙면 모드 활성화" : "수면 준비"}</h2>
        <p className="text-sm text-slate-400 mt-2">
          {isSleeping ? "당신이 잠든 동안 Somnus가 수면을 분석합니다." : "취침 시작 버튼을 눌러 수면을 기록하세요."}
        </p>
      </header>

      <section className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50 flex flex-col items-center">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-4">수면 타이머 (White Noise)</h3>
        <div className="text-5xl font-mono font-bold text-slate-100 mb-6">{formatTime(timer)}</div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsPlaying(isPlaying ? null : '1')}
            className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all"
          >
            {isPlaying ? <PauseIcon className="w-6 h-6 text-white" /> : <PlayIcon className="w-6 h-6 text-white ml-1" />}
          </button>
          <button 
            onClick={() => setTimer(600)}
            className="px-4 py-2 bg-slate-700 rounded-xl text-[10px] font-bold uppercase text-slate-300"
          >
            Reset
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400">사운드 믹스</h3>
        <div className="grid grid-cols-2 gap-3">
          {soundTracks.map((track) => (
            <button 
              key={track.id}
              onClick={() => setIsPlaying(isPlaying === track.id ? null : track.id)}
              className={`p-4 rounded-2xl border transition-all flex items-center gap-3 ${
                isPlaying === track.id 
                ? 'bg-indigo-500/20 border-indigo-500 shadow-lg' 
                : 'bg-slate-800/40 border-slate-700'
              }`}
            >
              <div className={`${isPlaying === track.id ? 'text-indigo-400' : 'text-slate-500'}`}>
                {track.icon}
              </div>
              <div className="text-left overflow-hidden">
                <p className="text-xs font-bold truncate">{track.name}</p>
                <p className="text-[8px] uppercase text-slate-500">{track.type}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <div className="bg-slate-800/20 border border-slate-800 p-4 rounded-2xl">
        <p className="text-[11px] text-slate-500 leading-relaxed text-center italic">
          "오늘 하루도 수고 많으셨습니다. 편안한 밤 되세요."
        </p>
      </div>
    </div>
  );
};

export default SleepRoutine;
