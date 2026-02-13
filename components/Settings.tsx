
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { BellIcon, MoonIcon, BellAlertIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const Settings: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: "김수면",
    targetSleepTime: "23:00",
    wakeUpTime: "07:30"
  });

  return (
    <div className="p-6 space-y-8">
      <header>
        <h2 className="text-2xl font-bold">계정 및 설정</h2>
      </header>

      <section className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xl font-bold">
            {profile.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold">{profile.name}</h3>
            <p className="text-xs text-slate-400">프라임 멤버십 이용 중</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1 block">수면 스케줄</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase">취침 목표</p>
                <input type="time" value={profile.targetSleepTime} className="bg-transparent text-lg font-bold text-indigo-300 w-full focus:outline-none" />
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase">기상 목표</p>
                <input type="time" value={profile.wakeUpTime} className="bg-transparent text-lg font-bold text-indigo-300 w-full focus:outline-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400">앱 환경 설정</h3>
        <div className="space-y-1">
          <SettingItem icon={<BellIcon className="w-5 h-5" />} label="취침 알림" active={true} />
          <SettingItem icon={<BellAlertIcon className="w-5 h-5" />} label="스마트 알람" active={false} />
          <SettingItem icon={<MoonIcon className="w-5 h-5" />} label="다크 모드" active={true} disabled />
        </div>
      </section>

      <button className="w-full flex items-center justify-center gap-2 py-4 text-rose-500 font-bold border border-rose-500/20 rounded-2xl hover:bg-rose-500/5 transition-colors">
        <ArrowRightOnRectangleIcon className="w-5 h-5" />
        로그아웃
      </button>

      <div className="text-center">
        <p className="text-[10px] text-slate-600 font-medium">SomnusAI v1.2.4 (Beta)</p>
      </div>
    </div>
  );
};

const SettingItem: React.FC<{ icon: React.ReactNode, label: string, active: boolean, disabled?: boolean }> = ({ icon, label, active, disabled }) => (
  <div className="flex items-center justify-between p-4 bg-slate-800/40 rounded-2xl border border-slate-700/30">
    <div className="flex items-center gap-3">
      <div className="text-indigo-400">{icon}</div>
      <span className="text-sm font-medium text-slate-200">{label}</span>
    </div>
    <div className={`w-12 h-6 rounded-full p-1 transition-colors ${active ? 'bg-indigo-500' : 'bg-slate-700'}`}>
      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${active ? 'translate-x-6' : 'translate-x-0'}`}></div>
    </div>
  </div>
);

export default Settings;
