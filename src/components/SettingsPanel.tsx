import { useState } from 'react';
import {
  X,
  CheckCircle2,
  Cloud,
  Mail,
  Shield,
  Key,
  Globe,
  Zap,
  RefreshCw,
  ExternalLink,
  Copy,
  Server,
} from 'lucide-react';
import { useEmailStore } from '../store/emailStore';
import { cn } from '../lib/utils';

export function SettingsPanel() {
  const {
    isSettingsOpen,
    closeSettings,
    smtpConfigured,
    setSmtpConfigured,
    domainVerified,
    setDomainVerified,
    workerDeployed,
    setWorkerDeployed,
    user,
  } = useEmailStore();

  const [activeTab, setActiveTab] = useState<'smtp' | 'domain' | 'worker' | 'auth'>(
    'smtp'
  );
  const [loading, setLoading] = useState(false);

  if (!isSettingsOpen) return null;

  const simulateAction = async (action: () => void) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    action();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeSettings}
      />
      <div className="relative glass-strong rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl border border-white/10 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Settings & Integrations
            </h2>
            <p className="text-xs text-white/40 mt-0.5">
              Auto-configuration · Domain · SMTP · Cloudflare
            </p>
          </div>
          <button
            onClick={closeSettings}
            className="p-2 rounded-lg hover:bg-white/10 text-white/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/8 px-4">
          {(
            [
              { id: 'smtp', label: 'Gmail SMTP', icon: Mail },
              { id: 'domain', label: 'Domain', icon: Globe },
              { id: 'worker', label: 'CF Worker', icon: Cloud },
              { id: 'auth', label: 'Auth', icon: Shield },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-3 text-sm border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-300'
                  : 'border-transparent text-white/40 hover:text-white/70'
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {activeTab === 'smtp' && (
            <>
              <StatusCard
                title="Gmail SMTP / API"
                description="Send emails via Gmail OAuth2 or App Password"
                active={smtpConfigured}
                icon={Mail}
              />
              <div className="space-y-3">
                <Field label="SMTP Host" value="smtp.gmail.com" />
                <Field label="Port" value="587 (TLS) / 465 (SSL)" />
                <Field label="Auth Method" value="OAuth2 / App Password" />
                <Field label="From Address" value={user.email} />
              </div>
              <div className="flex gap-2">
                <ActionButton
                  loading={loading}
                  onClick={() =>
                    simulateAction(() => setSmtpConfigured(true))
                  }
                  label={smtpConfigured ? 'Re-authenticate' : 'Connect Gmail'}
                  icon={Key}
                />
                {smtpConfigured && (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                  </span>
                )}
              </div>
              <InfoBox>
                UniVoiceMail uses Gmail API for sending with automatic token
                refresh. For production, configure OAuth2 client credentials in
                Google Cloud Console and set GOOGLE_CLIENT_ID /
                GOOGLE_CLIENT_SECRET environment variables.
              </InfoBox>
            </>
          )}

          {activeTab === 'domain' && (
            <>
              <StatusCard
                title="Domain Management"
                description={`DNS & email routing for ${user.domain}`}
                active={domainVerified}
                icon={Globe}
              />
              <div className="space-y-3">
                <Field label="Domain" value={user.domain} />
                <Field label="MX Records" value="route.mx.cloudflare.net" />
                <Field label="SPF" value={`v=spf1 include:_spf.mx.cloudflare.net ~all`} />
                <Field label="DKIM" value="Auto-managed by Cloudflare" />
                <Field label="DMARC" value="v=DMARC1; p=none; rua=mailto:dmarc@uniorbi.com" />
              </div>
              <ActionButton
                loading={loading}
                onClick={() => simulateAction(() => setDomainVerified(true))}
                label={domainVerified ? 'Re-verify DNS' : 'Verify Domain'}
                icon={RefreshCw}
              />
              <InfoBox>
                Point your domain's MX records to Cloudflare Email Routing.
                UniVoiceMail auto-detects verification status via Cloudflare API.
              </InfoBox>
            </>
          )}

          {activeTab === 'worker' && (
            <>
              <StatusCard
                title="Cloudflare Email Worker"
                description="Inbound email processing & routing"
                active={workerDeployed}
                icon={Cloud}
              />
              <div className="rounded-xl bg-black/30 border border-white/8 p-4 font-mono text-xs text-white/70 overflow-x-auto">
                <pre>{`// Cloudflare Worker — email handler
export default {
  async email(message, env, ctx) {
    const { from, to, headers, raw } = message;
    
    // Forward to UniVoiceMail API
    await fetch(env.UNIVOICE_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Worker-Secret': env.WORKER_SECRET,
      },
      body: JSON.stringify({
        from: from,
        to: to,
        subject: headers.get('subject'),
        raw: await new Response(raw).text(),
      }),
    });
  }
}`}</pre>
              </div>
              <div className="flex gap-2 flex-wrap">
                <ActionButton
                  loading={loading}
                  onClick={() =>
                    simulateAction(() => setWorkerDeployed(true))
                  }
                  label={workerDeployed ? 'Redeploy Worker' : 'Deploy Worker'}
                  icon={Zap}
                />
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-white/50 hover:bg-white/5 border border-white/8">
                  <Copy className="w-3.5 h-3.5" /> Copy Script
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-white/50 hover:bg-white/5 border border-white/8">
                  <ExternalLink className="w-3.5 h-3.5" /> CF Dashboard
                </button>
              </div>
              <InfoBox>
                Deploy this Worker via Wrangler or Cloudflare Dashboard. Bind
                it to your Email Routing rules for *@uniorbi.com. Incoming
                messages are POSTed to your UniVoiceMail backend webhook for
                storage and real-time push.
              </InfoBox>
            </>
          )}

          {activeTab === 'auth' && (
            <>
              <StatusCard
                title="Authentication"
                description="Auto OAuth, session & API keys"
                active={true}
                icon={Shield}
              />
              <div className="space-y-3">
                <Field label="Auth Provider" value="Google OAuth 2.0 + JWT" />
                <Field label="Session" value="HttpOnly Secure Cookie (7d)" />
                <Field label="API Key" value="uvm_••••••••••••••••••••" />
                <Field label="Webhook Secret" value="Configured ✓" />
              </div>
              <InfoBox>
                UniVoiceMail supports automatic authentication flows. Users
                sign in with Google; the app requests minimal Gmail scopes
                (gmail.send). Cloudflare Worker authenticates via shared
                secret headers.
              </InfoBox>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusCard({
  title,
  description,
  active,
  icon: Icon,
}: {
  title: string;
  description: string;
  active: boolean;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/8">
      <div
        className={cn(
          'w-11 h-11 rounded-xl flex items-center justify-center',
          active ? 'bg-emerald-500/20' : 'bg-white/5'
        )}
      >
        <Icon
          className={cn('w-5 h-5', active ? 'text-emerald-400' : 'text-white/30')}
        />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-white/40">{description}</p>
      </div>
      <span
        className={cn(
          'text-[11px] font-medium px-2.5 py-1 rounded-full',
          active
            ? 'bg-emerald-500/15 text-emerald-400'
            : 'bg-white/5 text-white/30'
        )}
      >
        {active ? 'Active' : 'Not configured'}
      </span>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5">
      <span className="text-xs text-white/40">{label}</span>
      <span className="text-xs text-white/70 font-mono">{value}</span>
    </div>
  );
}

function ActionButton({
  loading,
  onClick,
  label,
  icon: Icon,
}: {
  loading: boolean;
  onClick: () => void;
  label: string;
  icon: React.ElementType;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium hover:from-indigo-400 hover:to-purple-500 disabled:opacity-50 transition-all"
    >
      <Icon className={cn('w-4 h-4', loading && 'animate-spin')} />
      {loading ? 'Working...' : label}
    </button>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-indigo-500/10 border border-indigo-500/20 px-4 py-3 text-xs text-indigo-200/80 leading-relaxed">
      {children}
    </div>
  );
}
