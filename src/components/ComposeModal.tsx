import { useState, useEffect } from 'react';
import { X, Minus, Maximize2, Send, Paperclip, Trash2 } from 'lucide-react';
import { useEmailStore } from '../store/emailStore';
import { cn } from '../lib/utils';

export function ComposeModal() {
  const {
    isComposeOpen,
    closeCompose,
    composeMode,
    replyToEmail,
    sendEmail,
    user,
  } = useEmailStore();

  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [minimized, setMinimized] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (isComposeOpen && replyToEmail) {
      if (composeMode === 'reply') {
        setTo(replyToEmail.from.email);
        setSubject(
          replyToEmail.subject.startsWith('Re:')
            ? replyToEmail.subject
            : `Re: ${replyToEmail.subject}`
        );
        setBody(
          `\n\n---------- Original Message ----------\nFrom: ${replyToEmail.from.name || replyToEmail.from.email}\nDate: ${new Date(replyToEmail.date).toLocaleString()}\nSubject: ${replyToEmail.subject}\n\n${replyToEmail.body}`
        );
      } else if (composeMode === 'forward') {
        setTo('');
        setSubject(
          replyToEmail.subject.startsWith('Fwd:')
            ? replyToEmail.subject
            : `Fwd: ${replyToEmail.subject}`
        );
        setBody(
          `\n\n---------- Forwarded Message ----------\nFrom: ${replyToEmail.from.name || replyToEmail.from.email}\nDate: ${new Date(replyToEmail.date).toLocaleString()}\nSubject: ${replyToEmail.subject}\n\n${replyToEmail.body}`
        );
      }
    } else if (isComposeOpen) {
      setTo('');
      setSubject('');
      setBody('');
    }
    setMinimized(false);
  }, [isComposeOpen, composeMode, replyToEmail]);

  if (!isComposeOpen) return null;

  const handleSend = async () => {
    if (!to || !subject) return;
    setSending(true);
    // Simulate network + Gmail SMTP
    await new Promise((r) => setTimeout(r, 800));
    sendEmail({ to, subject, body });
    setSending(false);
    setTo('');
    setSubject('');
    setBody('');
  };

  if (minimized) {
    return (
      <div className="fixed bottom-0 right-6 z-50 w-72">
        <div
          className="glass-strong rounded-t-xl px-4 py-3 flex items-center gap-2 cursor-pointer border-b-0"
          onClick={() => setMinimized(false)}
        >
          <span className="text-sm font-medium text-white/80 flex-1 truncate">
            {subject || 'New Message'}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMinimized(false);
            }}
            className="p-1 hover:bg-white/10 rounded"
          >
            <Maximize2 className="w-3.5 h-3.5 text-white/50" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeCompose();
            }}
            className="p-1 hover:bg-white/10 rounded"
          >
            <X className="w-3.5 h-3.5 text-white/50" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 right-6 z-50 w-[520px] max-w-[calc(100vw-2rem)] compose-modal">
      <div className="glass-strong rounded-t-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[70vh]">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border-b border-white/8">
          <span className="text-sm font-medium text-white/80 flex-1">
            {composeMode === 'reply'
              ? 'Reply'
              : composeMode === 'forward'
              ? 'Forward'
              : 'New Message'}
          </span>
          <button
            onClick={() => setMinimized(true)}
            className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white/70"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={closeCompose}
            className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white/70"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Fields */}
        <div className="px-4 pt-3 space-y-0">
          <div className="flex items-center border-b border-white/6 py-2">
            <span className="text-xs text-white/35 w-12">From</span>
            <span className="text-sm text-white/60">{user.email}</span>
          </div>
          <div className="flex items-center border-b border-white/6 py-2">
            <span className="text-xs text-white/35 w-12">To</span>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/25 focus:outline-none"
            />
          </div>
          <div className="flex items-center border-b border-white/6 py-2">
            <span className="text-xs text-white/35 w-12">Subject</span>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/25 focus:outline-none"
            />
          </div>
        </div>

        {/* Body */}
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your message..."
          className="flex-1 min-h-[200px] px-4 py-3 bg-transparent text-sm text-white/90 placeholder:text-white/25 focus:outline-none resize-none"
        />

        {/* Footer */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-white/8">
          <button
            onClick={handleSend}
            disabled={!to || !subject || sending}
            className={cn(
              'flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all',
              to && subject && !sending
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-400 hover:to-purple-500 glow-primary'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
            )}
          >
            <Send className="w-4 h-4" />
            {sending ? 'Sending...' : 'Send'}
          </button>
          <button className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/70">
            <Paperclip className="w-4 h-4" />
          </button>
          <div className="flex-1" />
          <button
            onClick={closeCompose}
            className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/70"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
