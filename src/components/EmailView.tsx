import {
  ArrowLeft,
  Star,
  Archive,
  Trash2,
  Reply,
  ReplyAll,
  Forward,
  MoreHorizontal,
  Paperclip,
  Download,
  Printer,
} from 'lucide-react';
import { useEmailStore } from '../store/emailStore';
import {
  cn,
  formatFullDate,
  getInitials,
  getAvatarColor,
  formatBytes,
} from '../lib/utils';

export function EmailView() {
  const {
    emails,
    selectedEmailId,
    setSelectedEmailId,
    toggleStar,
    deleteEmail,
    archiveEmail,
    openCompose,
    isMobileView,
  } = useEmailStore();

  const email = emails.find((e) => e.id === selectedEmailId);

  if (!email) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-white/25 glass-strong">
        <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-4">
          <svg
            className="w-10 h-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-sm">Select an email to read</p>
        <p className="text-xs mt-1 text-white/15">
          UniVoiceMail · Enterprise Edition
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full glass-strong overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-white/5">
        {isMobileView && (
          <button
            onClick={() => setSelectedEmailId(null)}
            className="p-2 rounded-lg hover:bg-white/10 text-white/60 mr-1"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <ActionBtn
          icon={Archive}
          label="Archive"
          onClick={() => archiveEmail(email.id)}
        />
        <ActionBtn
          icon={Trash2}
          label="Delete"
          onClick={() => deleteEmail(email.id)}
        />
        <div className="w-px h-5 bg-white/10 mx-1" />
        <ActionBtn
          icon={Reply}
          label="Reply"
          onClick={() => openCompose('reply', email)}
        />
        <ActionBtn
          icon={ReplyAll}
          label="Reply All"
          onClick={() => openCompose('reply', email)}
        />
        <ActionBtn
          icon={Forward}
          label="Forward"
          onClick={() => openCompose('forward', email)}
        />
        <div className="flex-1" />
        <ActionBtn icon={Printer} label="Print" />
        <ActionBtn icon={MoreHorizontal} label="More" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-6">
          {/* Subject */}
          <div className="flex items-start gap-3 mb-6">
            <h1 className="text-xl font-semibold text-white flex-1 leading-snug">
              {email.subject}
            </h1>
            <button
              onClick={() => toggleStar(email.id)}
              className="p-1.5 rounded-lg hover:bg-white/10 mt-0.5"
            >
              <Star
                className={cn(
                  'w-5 h-5',
                  email.isStarred
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-white/30 hover:text-white/50'
                )}
              />
            </button>
          </div>

          {/* Labels */}
          {email.labels.length > 0 && (
            <div className="flex gap-1.5 mb-5">
              {email.labels.map((label) => (
                <span
                  key={label}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/20"
                >
                  {label}
                </span>
              ))}
            </div>
          )}

          {/* Sender */}
          <div className="flex items-start gap-3 mb-6">
            <div
              className={cn(
                'w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0',
                getAvatarColor(email.from.email)
              )}
            >
              {getInitials(email.from.name || email.from.email)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-medium text-white text-sm">
                  {email.from.name || email.from.email}
                </span>
                <span className="text-xs text-white/40">
                  &lt;{email.from.email}&gt;
                </span>
              </div>
              <div className="text-xs text-white/35 mt-0.5">
                to {email.to.map((t) => t.name || t.email).join(', ')}
              </div>
              <div className="text-[11px] text-white/25 mt-0.5">
                {formatFullDate(email.date)}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap mb-8">
            {email.body}
          </div>

          {/* Attachments */}
          {email.attachments && email.attachments.length > 0 && (
            <div className="border-t border-white/8 pt-5">
              <p className="text-xs font-medium text-white/40 mb-3 uppercase tracking-wider">
                Attachments ({email.attachments.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {email.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/8 hover:bg-white/8 transition-colors cursor-pointer group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                      <Paperclip className="w-4 h-4 text-indigo-300" />
                    </div>
                    <div>
                      <p className="text-sm text-white/80 group-hover:text-white">
                        {att.name}
                      </p>
                      <p className="text-[11px] text-white/30">
                        {formatBytes(att.size)}
                      </p>
                    </div>
                    <Download className="w-4 h-4 text-white/20 group-hover:text-white/50 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ActionBtn({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white/80 transition-colors"
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
