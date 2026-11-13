import {
  Inbox,
  Star,
  Send,
  FileEdit,
  Archive,
  ShieldAlert,
  Trash2,
  PenSquare,
  Settings,
  Menu,
  X,
  Cloud,
  CheckCircle2,
  Mail,
} from 'lucide-react';
import { useEmailStore } from '../store/emailStore';
import { cn } from '../lib/utils';

const iconMap: Record<string, React.ElementType> = {
  Inbox,
  Star,
  Send,
  FileEdit,
  Archive,
  ShieldAlert,
  Trash2,
};

export function Sidebar() {
  const {
    folders,
    selectedFolder,
    setSelectedFolder,
    openCompose,
    isSidebarOpen,
    toggleSidebar,
    isMobileView,
    openSettings,
    user,
    smtpConfigured,
    domainVerified,
    workerDeployed,
  } = useEmailStore();

  if (isMobileView && !isSidebarOpen) return null;

  return (
    <>
      {isMobileView && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      <aside
        className={cn(
          'glass-strong flex flex-col h-full z-50 transition-all duration-300',
          isMobileView
            ? 'fixed left-0 top-0 bottom-0 w-72'
            : 'relative w-64 shrink-0',
          isMobileView && !isSidebarOpen && '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center glow-primary">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white">
                UniVoiceMail
              </h1>
              <p className="text-[10px] text-white/40">{user.domain}</p>
            </div>
          </div>
          {isMobileView && (
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/60"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Compose */}
        <div className="p-3">
          <button
            onClick={() => {
              openCompose('new');
              if (isMobileView) toggleSidebar();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium hover:from-indigo-400 hover:to-purple-500 transition-all glow-primary shadow-lg"
          >
            <PenSquare className="w-4 h-4" />
            Compose
          </button>
        </div>

        {/* Folders */}
        <nav className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
          {folders.map((folder) => {
            const Icon = iconMap[folder.icon] || Inbox;
            const isActive = selectedFolder === folder.id;
            return (
              <button
                key={folder.id}
                onClick={() => {
                  setSelectedFolder(folder.id);
                  if (isMobileView) toggleSidebar();
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all',
                  isActive
                    ? 'bg-indigo-500/20 text-indigo-300 font-medium'
                    : 'text-white/60 hover:bg-white/5 hover:text-white/90'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1 text-left">{folder.name}</span>
                {folder.unread !== undefined && folder.unread > 0 && (
                  <span className="text-[11px] font-semibold bg-indigo-500 text-white px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {folder.unread}
                  </span>
                )}
                {folder.count !== undefined && folder.count > 0 && (
                  <span className="text-[11px] text-white/40">{folder.count}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Status indicators */}
        <div className="p-3 border-t border-white/5 space-y-2">
          <div className="text-[10px] uppercase tracking-wider text-white/30 px-1 mb-1">
            System Status
          </div>
          <StatusItem
            icon={Cloud}
            label="Cloudflare Worker"
            active={workerDeployed}
          />
          <StatusItem
            icon={CheckCircle2}
            label="Domain Verified"
            active={domainVerified}
          />
          <StatusItem
            icon={Mail}
            label="Gmail SMTP"
            active={smtpConfigured}
          />
        </div>

        {/* Settings + User */}
        <div className="p-3 border-t border-white/5">
          <button
            onClick={openSettings}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-white/5 hover:text-white/90 transition-all"
          >
            <Settings className="w-4 h-4" />
            Settings & Integrations
          </button>
          <div className="mt-2 flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
              UV
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white/90 truncate">
                {user.name}
              </p>
              <p className="text-[10px] text-white/40 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function StatusItem({
  icon: Icon,
  label,
  active,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center gap-2 px-1">
      <Icon
        className={cn('w-3.5 h-3.5', active ? 'text-emerald-400' : 'text-white/30')}
      />
      <span className={cn('text-[11px]', active ? 'text-white/70' : 'text-white/30')}>
        {label}
      </span>
      <span
        className={cn(
          'ml-auto w-1.5 h-1.5 rounded-full',
          active ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]' : 'bg-white/20'
        )}
      />
    </div>
  );
}
