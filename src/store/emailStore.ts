import { create } from 'zustand';
import type { Email, Folder, UserProfile } from '../types/email';

const DEMO_EMAILS: Email[] = [
  {
    id: '1',
    threadId: 't1',
    from: { name: 'Sarah Chen', email: 'sarah@techcorp.io' },
    to: [{ name: 'You', email: 'hello@uniorbi.com' }],
    subject: 'Q4 Product Roadmap Review — Action Required',
    body: `Hi team,\n\nI've attached the latest Q4 roadmap for UniVoiceMail. Please review the AI prioritization features and the new Cloudflare Worker email routing integration.\n\nKey points:\n• Real-time IMAP sync improvements\n• Gmail SMTP auto-auth via OAuth2\n• Domain verification automation\n\nLet's discuss in tomorrow's standup.\n\nBest,\nSarah`,
    preview: "I've attached the latest Q4 roadmap for UniVoiceMail. Please review the AI prioritization...",
    date: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    isRead: false,
    isStarred: true,
    isImportant: true,
    labels: ['work', 'priority'],
    folder: 'inbox',
    hasAttachments: true,
    attachments: [{ id: 'a1', name: 'Q4_Roadmap.pdf', size: 2450000, type: 'application/pdf' }],
  },
  {
    id: '2',
    threadId: 't2',
    from: { name: 'Cloudflare Team', email: 'noreply@cloudflare.com' },
    to: [{ email: 'hello@uniorbi.com' }],
    subject: 'Your Email Worker is live on uniorbi.com',
    body: `Congratulations!\n\nYour Cloudflare Email Worker for uniorbi.com has been successfully deployed.\n\n• Routing rules: active\n• Catch-all: enabled\n• Worker script: uni-email-router\n\nYou can now receive emails at *@uniorbi.com.\n\n— Cloudflare`,
    preview: 'Your Cloudflare Email Worker for uniorbi.com has been successfully deployed.',
    date: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    isRead: false,
    isStarred: false,
    isImportant: false,
    labels: ['system'],
    folder: 'inbox',
    hasAttachments: false,
  },
  {
    id: '3',
    threadId: 't3',
    from: { name: 'Alex Rivera', email: 'alex@designstudio.co' },
    to: [{ email: 'hello@uniorbi.com' }],
    subject: 'Re: UniVoiceMail UI — Glass morphism feedback',
    body: `Hey!\n\nThe live wallpaper + glass panels look incredible. The aurora animation is buttery smooth on mobile too.\n\nMinor suggestion: slightly increase contrast on the unread badge for accessibility.\n\nOtherwise ship it 🔥\n\nAlex`,
    preview: 'The live wallpaper + glass panels look incredible. The aurora animation is buttery smooth...',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    isRead: true,
    isStarred: false,
    isImportant: false,
    labels: ['design'],
    folder: 'inbox',
    hasAttachments: false,
  },
  {
    id: '4',
    threadId: 't4',
    from: { name: 'Gmail Security', email: 'no-reply@accounts.google.com' },
    to: [{ email: 'hello@uniorbi.com' }],
    subject: 'Security alert: New app connected to your Google Account',
    body: `UniVoiceMail was granted access to send email via Gmail SMTP on your behalf.\n\nIf this was you, no action needed. App scopes: gmail.send, gmail.compose.\n\n— Google Accounts`,
    preview: 'UniVoiceMail was granted access to send email via Gmail SMTP on your behalf.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    isRead: true,
    isStarred: false,
    isImportant: true,
    labels: ['security'],
    folder: 'inbox',
    hasAttachments: false,
  },
  {
    id: '5',
    threadId: 't5',
    from: { name: 'Jordan Lee', email: 'jordan@startup.io' },
    to: [{ email: 'hello@uniorbi.com' }],
    subject: 'Partnership proposal — UniVoiceMail × OrbitMail',
    body: `Hi UniVoiceMail team,\n\nWe love what you're building. Would love to explore a white-label partnership for our enterprise clients.\n\nOpen to a call next week?\n\nJordan`,
    preview: 'We love what you\'re building. Would love to explore a white-label partnership...',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    isRead: true,
    isStarred: true,
    isImportant: false,
    labels: ['business'],
    folder: 'inbox',
    hasAttachments: false,
  },
  {
    id: '6',
    threadId: 't6',
    from: { name: 'You', email: 'hello@uniorbi.com' },
    to: [{ name: 'Support', email: 'support@cloudflare.com' }],
    subject: 'Domain verification for email routing',
    body: `Hi Cloudflare Support,\n\nWe've completed DNS setup for uniorbi.com. MX records point to your email routing.\n\nPlease confirm verification status.\n\nThanks,\nUniVoiceMail Team`,
    preview: "We've completed DNS setup for uniorbi.com. MX records point to your email routing.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    isRead: true,
    isStarred: false,
    isImportant: false,
    labels: [],
    folder: 'sent',
    hasAttachments: false,
  },
];

const FOLDERS: Folder[] = [
  { id: 'inbox', name: 'Inbox', icon: 'Inbox', unread: 2 },
  { id: 'starred', name: 'Starred', icon: 'Star' },
  { id: 'sent', name: 'Sent', icon: 'Send' },
  { id: 'drafts', name: 'Drafts', icon: 'FileEdit', count: 1 },
  { id: 'archive', name: 'Archive', icon: 'Archive' },
  { id: 'spam', name: 'Spam', icon: 'ShieldAlert' },
  { id: 'trash', name: 'Trash', icon: 'Trash2' },
];

interface EmailState {
  emails: Email[];
  folders: Folder[];
  selectedFolder: string;
  selectedEmailId: string | null;
  searchQuery: string;
  isComposeOpen: boolean;
  composeMode: 'new' | 'reply' | 'forward';
  replyToEmail: Email | null;
  user: UserProfile;
  isSidebarOpen: boolean;
  isMobileView: boolean;
  isSettingsOpen: boolean;
  isAuthenticated: boolean;
  smtpConfigured: boolean;
  domainVerified: boolean;
  workerDeployed: boolean;

  setSelectedFolder: (id: string) => void;
  setSelectedEmailId: (id: string | null) => void;
  setSearchQuery: (q: string) => void;
  openCompose: (mode?: 'new' | 'reply' | 'forward', email?: Email) => void;
  closeCompose: () => void;
  toggleStar: (id: string) => void;
  markAsRead: (id: string) => void;
  deleteEmail: (id: string) => void;
  archiveEmail: (id: string) => void;
  sendEmail: (data: { to: string; subject: string; body: string }) => void;
  toggleSidebar: () => void;
  setMobileView: (v: boolean) => void;
  openSettings: () => void;
  closeSettings: () => void;
  setAuthenticated: (v: boolean) => void;
  setSmtpConfigured: (v: boolean) => void;
  setDomainVerified: (v: boolean) => void;
  setWorkerDeployed: (v: boolean) => void;
}

export const useEmailStore = create<EmailState>((set, get) => ({
  emails: DEMO_EMAILS,
  folders: FOLDERS,
  selectedFolder: 'inbox',
  selectedEmailId: null,
  searchQuery: '',
  isComposeOpen: false,
  composeMode: 'new',
  replyToEmail: null,
  user: {
    name: 'UniVoiceMail Admin',
    email: 'hello@uniorbi.com',
    domain: 'uniorbi.com',
  },
  isSidebarOpen: true,
  isMobileView: false,
  isSettingsOpen: false,
  isAuthenticated: true,
  smtpConfigured: true,
  domainVerified: true,
  workerDeployed: true,

  setSelectedFolder: (id) => set({ selectedFolder: id, selectedEmailId: null }),
  setSelectedEmailId: (id) => {
    set({ selectedEmailId: id });
    if (id) {
      const email = get().emails.find((e) => e.id === id);
      if (email && !email.isRead) {
        set({
          emails: get().emails.map((e) =>
            e.id === id ? { ...e, isRead: true } : e
          ),
        });
      }
    }
  },
  setSearchQuery: (q) => set({ searchQuery: q }),
  openCompose: (mode = 'new', email) =>
    set({ isComposeOpen: true, composeMode: mode, replyToEmail: email || null }),
  closeCompose: () => set({ isComposeOpen: false, replyToEmail: null }),
  toggleStar: (id) =>
    set({
      emails: get().emails.map((e) =>
        e.id === id ? { ...e, isStarred: !e.isStarred } : e
      ),
    }),
  markAsRead: (id) =>
    set({
      emails: get().emails.map((e) =>
        e.id === id ? { ...e, isRead: true } : e
      ),
    }),
  deleteEmail: (id) =>
    set({
      emails: get().emails.map((e) =>
        e.id === id ? { ...e, folder: 'trash' } : e
      ),
      selectedEmailId: get().selectedEmailId === id ? null : get().selectedEmailId,
    }),
  archiveEmail: (id) =>
    set({
      emails: get().emails.map((e) =>
        e.id === id ? { ...e, folder: 'archive' } : e
      ),
      selectedEmailId: null,
    }),
  sendEmail: (data) => {
    const newEmail: Email = {
      id: `sent-${Date.now()}`,
      threadId: `t-${Date.now()}`,
      from: { name: get().user.name, email: get().user.email },
      to: [{ email: data.to }],
      subject: data.subject,
      body: data.body,
      preview: data.body.slice(0, 100),
      date: new Date().toISOString(),
      isRead: true,
      isStarred: false,
      isImportant: false,
      labels: [],
      folder: 'sent',
      hasAttachments: false,
    };
    set({ emails: [newEmail, ...get().emails], isComposeOpen: false });
  },
  toggleSidebar: () => set({ isSidebarOpen: !get().isSidebarOpen }),
  setMobileView: (v) => set({ isMobileView: v }),
  openSettings: () => set({ isSettingsOpen: true }),
  closeSettings: () => set({ isSettingsOpen: false }),
  setAuthenticated: (v) => set({ isAuthenticated: v }),
  setSmtpConfigured: (v) => set({ smtpConfigured: v }),
  setDomainVerified: (v) => set({ domainVerified: v }),
  setWorkerDeployed: (v) => set({ workerDeployed: v }),
}));
