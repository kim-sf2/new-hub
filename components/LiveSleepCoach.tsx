
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { 
  MicrophoneIcon, 
  StopIcon, 
  SparklesIcon
} from '@heroicons/react/24/solid';

const LiveSleepCoach: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcription, setTranscription] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const decodeAudioData = async (
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const createBlob = (data: Float32Array) => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  const startSession = async () => {
    setIsConnecting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
            (window as any)._scriptProcessor = scriptProcessor;
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              setTranscription(prev => [...prev.slice(-3), `코치: ${message.serverContent?.outputTranscription?.text}`]);
            } else if (message.serverContent?.inputTranscription) {
              setTranscription(prev => [...prev.slice(-3), `나: ${message.serverContent?.inputTranscription?.text}`]);
            }
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && outputAudioContextRef.current) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current.currentTime);
              const buffer = await decodeAudioData(decode(audioData), outputAudioContextRef.current, 24000, 1);
              const source = outputAudioContextRef.current.createBufferSource();
              source.buffer = buffer;
              source.connect(outputAudioContextRef.current.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }
          },
          onerror: (e) => console.error('Error:', e),
          onclose: () => stopSession(),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: '당신은 SomnusAI의 수면 코치입니다. 매우 차분하고 다정한 말투로 사용자가 편안하게 잠들 수 있도록 돕습니다. 한국어로 대화하세요. 오늘 하루를 물어보거나, 호흡법을 안내하거나, 수면 위생 팁을 알려주세요.',
          outputAudioTranscription: {},
          inputAudioTranscription: {},
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    setIsActive(false);
    setIsConnecting(false);
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    setTranscription([]);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-12">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className={`w-32 h-32 rounded-full border-2 border-indigo-500/30 flex items-center justify-center transition-all duration-500 ${isActive ? 'scale-110' : 'scale-100'}`}>
              <div className={`w-24 h-24 rounded-full bg-indigo-500 flex items-center justify-center shadow-2xl shadow-indigo-500/40 relative z-10 ${isActive ? 'animate-pulse' : ''}`}>
                <SparklesIcon className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI 수면 코치</h2>
            <p className="text-slate-400 text-sm mt-1">
              {isActive ? "듣고 있어요. 편하게 말씀하세요..." : "잠들기 전 고민을 들려주세요"}
            </p>
          </div>
        </div>

        <div className="w-full max-w-xs space-y-3 bg-slate-800/30 rounded-2xl p-4 min-h-[120px] flex flex-col justify-end border border-slate-700/30">
          {transcription.map((line, idx) => (
            <p key={idx} className={`text-xs ${line.startsWith('나:') ? 'text-slate-400 text-right' : 'text-indigo-300 font-medium'}`}>
              {line}
            </p>
          ))}
        </div>

        <button 
          onClick={isActive ? stopSession : startSession}
          disabled={isConnecting}
          className={`group flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold transition-all duration-300 ${
            isActive ? 'bg-rose-500 text-white' : 'bg-indigo-500 text-white shadow-lg shadow-indigo-900/20'
          }`}
        >
          {isConnecting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : isActive ? <StopIcon className="w-6 h-6" /> : <MicrophoneIcon className="w-6 h-6" />}
          <span>{isConnecting ? '연결 중...' : isActive ? '대화 종료' : '대화 시작하기'}</span>
        </button>
      </div>

      <div className="p-6 bg-slate-800/20 border-t border-slate-800/50">
        <h3 className="text-[10px] uppercase tracking-widest text-slate-500 mb-4 font-bold text-center">추천 대화 주제</h3>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {["호흡법 알려줘", "마음이 불안해", "오늘 일과 정리", "잠오는 이야기 해줘"].map(tip => (
            <button key={tip} className="whitespace-nowrap px-4 py-2 bg-slate-800 rounded-full text-xs text-slate-300 hover:bg-slate-700">
              {tip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveSleepCoach;
