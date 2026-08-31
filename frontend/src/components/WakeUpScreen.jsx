export default function WakeUpScreen({ attemptCount, elapsedSeconds, status }) {
  const progress = Math.min(96, Math.max(10, (elapsedSeconds / 90) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/10 px-4 backdrop-blur-sm">
      <div className="w-full max-w-[400px] rounded-2xl border border-white/80 bg-white/90 px-7 py-8 text-center shadow-[0_24px_80px_-36px_rgba(51,65,85,0.7)] backdrop-blur-md">
        <div className="relative mx-auto mb-6 flex h-[72px] w-[72px] items-center justify-center">
          <div className="absolute h-[72px] w-[72px] rounded-full bg-pink-300/35 blur-xl animate-wake-glow" />
          <div className="absolute h-[58px] w-[58px] rounded-full border-[5px] border-transparent border-l-sky-400 border-t-violet-500 animate-spin" />
          <div className="relative h-4 w-4 rounded-full bg-violet-500 shadow-[0_0_28px_rgba(139,92,246,0.7)]" />
        </div>

        <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[0.66rem] font-extrabold uppercase tracking-[0.18em] text-slate-600 shadow-[0_10px_30px_-24px_rgba(51,65,85,0.8)]">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          Backend Initialising
        </div>

        <h2 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-[linear-gradient(90deg,#6694ff,#9c6cf4,#df6f99)]">
          {status}
        </h2>

        <p className="mx-auto mt-4 max-w-xs text-sm font-medium leading-6 text-slate-600">
          Render may need a moment to wake the backend before the analyzer is
          ready.
        </p>

        <div className="mt-7">
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#8b5cf6,#e46f9c,#4ea8f7)] transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-3 flex flex-col items-center justify-between gap-1 text-xs font-semibold text-slate-500 sm:flex-row">
            <span>Polling /health every 3s</span>
            <span>
              Attempt {attemptCount} - Elapsed: {elapsedSeconds}s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
