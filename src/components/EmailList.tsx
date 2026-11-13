import { Star, Paperclip, Search, Menu, RefreshCw } from 'lucide-react';
import { useEmailStore } from '../store/emailStore';
import { cn, formatEmailDate, getInitials, getAvatarColor } from '../lib/utils';

export function EmailList() {
  const {
    emails,
    selectedFolder,
    selectedEmailId,
    setSelectedEmailId,
    searchQuery,
    setSearchQuery,
    toggleStar,
    toggleSidebar,
    isMobileView,
  } = useEmailStore();

  const filtered = emails
    .filter((e) => {
      if (selectedFolder === 'starred') return e.isStarred;
      return e.folder === selectedFolder;
    })
    .filter((e) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        e.subject.toLowerCase().includes(q) ||
        e.from.name?.toLowerCase().includes(q) ||
        e.from.email.toLowerCase().includes(q) ||
        e.preview.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const folderName =
    selectedFolder.charAt(0).toUpperCase() + selectedFolder.slice(1);

  return (
    <div
      className={cn(
        'flex flex-col h-full glass-strong',
        isMobileView && selectedEmailId ? 'hidden' : 'flex',
        !isMobileView && 'w-[380px] shrink-0 border-r border-white/5'
      )}
    >
      {/* Toolbar */}
      <div className="p-3 border-b border-white/5 space-y-3">
        <div className="flex items-center gap-2">
          {isMobileView && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-white/10 text-white/60"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <h2 className="text-base font-semibold text-white flex-1">{folderName}</h2>
          <button className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/70 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search mail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/8 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 focus:bg-white/8 transition-all"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-white/30 text-sm">
            <p>No emails found</p>
          </div>
        ) : (
          filtered.map((email) => {
            const isSelected = selectedEmailId === email.id;
            return (
              <div
                key={email.id}
                onClick={() => setSelectedEmailId(email.id)}
                className={cn(
                  'email-item flex gap-3 px-4 py-3 cursor-pointer border-b border-white/3',
                  isSelected && 'selected',
                  !email.isRead && 'bg-white/[0.03]'
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0',
                    getAvatarColor(email.from.email)
                  )}
                >
                  {getInitials(email.from.name || email.from.email)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className={cn(
                        'text-sm truncate flex-1',
                        !email.isRead
                          ? 'font-semibold text-white'
                          : 'text-white/70'
                      )}
                    >
                      {email.from.name || email.from.email}
                    </span>
                    <span className="text-[11px] text-white/40 shrink-0">
                      {formatEmailDate(email.date)}
                    </span>
                  </div>
                  <p
                    className={cn(
                      'text-sm truncate mb-0.5',
                      !email.isRead
                        ? 'font-medium text-white/90'
                        : 'text-white/50'
                    )}
                  >
                    {email.subject}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs text-white/35 truncate flex-1">
                      {email.preview}
                    </p>
                    {email.hasAttachments && (
                      <Paperclip className="w-3 h-3 text-white/30 shrink-0" />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(email.id);
                      }}
                      className="shrink-0 p-0.5"
                    >
                      <Star
                        className={cn(
                          'w-3.5 h-3.5',
                          email.isStarred
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-white/20 hover:text-white/40'
                        )}
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
