
import React, { useState, useEffect } from 'react';
import SleepDashboard from './components/SleepDashboard';
import FoodSubscription from './components/FoodSubscription';
import LiveSleepCoach from './components/LiveSleepCoach';
import SleepRoutine from './components/SleepRoutine';
import Settings from './components/Settings';
import { SleepLog } from './types';
import { 
  HomeIcon, 
  BeakerIcon, 
  ChatBubbleLeftRightIcon, 
  MoonIcon, 
  Cog6ToothIcon,
  PlayIcon,
  StopIcon
} from '@heroicons/react/24/outline';

type Tab = 'dashboard' | 'subscription' | 'coach' | 'routine' | 'settings';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [logs, setLogs] = useState<SleepLog[]>([]);
  const [isSleeping, setIsSleeping] = useState(false);
  const [currentStartTime, setCurrentStartTime] = useState<string | null>(null);

  // 데이터 로드
  useEffect(() => {
    const savedLogs = localStorage.getItem('somnus_logs');
    if (savedLogs) setLogs(JSON.parse(savedLogs));
    
    const sleepingState = localStorage.getItem('somnus_is_sleeping');
    const startTime = localStorage.getItem('somnus_start_time');
    if (sleepingState === 'true' && startTime) {
      setIsSleeping(true);
      setCurrentStartTime(startTime);
    }
  }, []);

  // 취침 시작
  const handleStartSleep = () => {
    const now = new Date().toISOString();
    setIsSleeping(true);
    setCurrentStartTime(now);
    localStorage.setItem('somnus_is_sleeping', 'true');
    localStorage.setItem('somnus_start_time', now);
    setActiveTab('routine'); // 수면 루틴 페이지로 이동
  };

  // 기상 완료
  const handleWakeUp = () => {
    if (!currentStartTime) return;
    
    const end = new Date();
    const start = new Date(currentStartTime);
    const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    
    const newLog: SleepLog = {
      id: Date.now().toString(),
      startTime: currentStartTime,
      endTime: end.toISOString(),
      duration: parseFloat(diffHours.toFixed(1)),
      quality: Math.min(100, Math.round(diffHours * 12)) // 단순 수식: 시간에 비례
    };

    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem('somnus_logs', JSON.stringify(updatedLogs));
    
    setIsSleeping(false);
    setCurrentStartTime(null);
    localStorage.removeItem('somnus_is_sleeping');
    localStorage.removeItem('somnus_start_time');
    setActiveTab('dashboard');

    if (updatedLogs.length === 30) {
      alert("축하합니다! 30일간의 수면 데이터가 완성되었습니다. 케어 탭에서 리포트를 확인하세요.");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <SleepDashboard logs={logs} />;
      case 'subscription': return <FoodSubscription logs={logs} />;
      case 'coach': return <LiveSleepCoach />;
      case 'routine': return <SleepRoutine isSleeping={isSleeping} />;
      case 'settings': return <Settings />;
      default: return <SleepDashboard logs={logs} />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-900 overflow-hidden shadow-2xl relative text-slate-100">
      <header className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <MoonIcon className="w-6 h-6 text-indigo-400" />
          <h1 className="text-xl font-bold tracking-tight">SomnusAI</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-400 font-medium bg-slate-800 px-2 py-1 rounded-full">
            데이터 {logs.length}/30일
          </span>
          {isSleeping ? (
            <button onClick={handleWakeUp} className="flex items-center gap-1 bg-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-full animate-pulse">
              <StopIcon className="w-3 h-3" /> 기상 완료
            </button>
          ) : (
            <button onClick={handleStartSleep} className="flex items-center gap-1 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">
              <PlayIcon className="w-3 h-3" /> 취침 시작
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto custom-scroll pb-24">
        {renderContent()}
      </main>

      <nav className="fixed bottom-0 w-full max-w-md border-t border-slate-800 bg-slate-900/90 backdrop-blur-lg px-2 py-3 flex justify-around items-center z-20">
        <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<HomeIcon className="w-6 h-6" />} label="홈" />
        <NavButton active={activeTab === 'subscription'} onClick={() => setActiveTab('subscription')} icon={<BeakerIcon className="w-6 h-6" />} label="케어" />
        <NavButton active={activeTab === 'coach'} onClick={() => setActiveTab('coach')} icon={<ChatBubbleLeftRightIcon className="w-6 h-6" />} label="코칭" />
        <NavButton active={activeTab === 'routine'} onClick={() => setActiveTab('routine')} icon={<MoonIcon className="w-6 h-6" />} label="수면" />
        <NavButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Cog6ToothIcon className="w-6 h-6" />} label="설정" />
      </nav>
    </div>
  );
};

const NavButton: React.FC<{active: boolean, onClick: () => void, icon: React.ReactNode, label: string}> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-colors duration-200 ${active ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}>
    {icon}
    <span className="text-[10px] font-medium tracking-wider">{label}</span>
  </button>
);

export default App;
