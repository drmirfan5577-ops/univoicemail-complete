import { useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { EmailList } from './components/EmailList';
import { EmailView } from './components/EmailView';
import { ComposeModal } from './components/ComposeModal';
import { SettingsPanel } from './components/SettingsPanel';
import { useEmailStore } from './store/emailStore';

export default function App() {
  const { setMobileView, isMobileView, selectedEmailId } = useEmailStore();

  useEffect(() => {
    const check = () => setMobileView(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [setMobileView]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* 24/7 Live Wallpaper */}
      <div className="live-wallpaper" aria-hidden="true" />

      {/* App Shell */}
      <div className="relative z-10 flex h-full p-2 md:p-3 gap-2 md:gap-3">
        <Sidebar />
        <div className="flex-1 flex overflow-hidden rounded-2xl border border-white/8 shadow-2xl">
          <EmailList />
          {(!isMobileView || selectedEmailId) && <EmailView />}
        </div>
      </div>

      <ComposeModal />
      <SettingsPanel />
    </div>
  );
}
