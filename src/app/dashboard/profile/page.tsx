'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Tabs } from '@/components/ui/Tabs';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Mock Data                                                                 */
/* -------------------------------------------------------------------------- */

const mockApiKeys = [
  { id: 'key_1', name: 'Production API Key', prefix: 'sk_live_...a3Xf', createdAt: '2026-01-10', lastUsed: '2026-02-28' },
  { id: 'key_2', name: 'Development Key', prefix: 'sk_test_...9kLm', createdAt: '2026-02-01', lastUsed: '2026-02-27' },
];

const mockSessions = [
  { id: 'sess_1', device: 'Chrome on macOS', ip: '192.168.1.42', location: 'San Francisco, CA', lastActive: '2026-03-01 09:15', current: true },
  { id: 'sess_2', device: 'Firefox on Windows', ip: '10.0.0.88', location: 'New York, NY', lastActive: '2026-02-28 14:32', current: false },
  { id: 'sess_3', device: 'Safari on iPhone', ip: '172.16.0.12', location: 'Austin, TX', lastActive: '2026-02-26 20:07', current: false },
];

/* -------------------------------------------------------------------------- */
/*  Page Component                                                            */
/* -------------------------------------------------------------------------- */

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('personal');

  /* --- Personal Info State --- */
  const [name, setName] = useState('Alex Johnson');
  const [email, setEmail] = useState('alex@example.com');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [bio, setBio] = useState('Full-stack developer and design enthusiast.');
  const [company, setCompany] = useState('Samya Web');
  const [website, setWebsite] = useState('https://alexjohnson.dev');

  /* --- Password State --- */
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  /* --- 2FA --- */
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFAStep, setTwoFAStep] = useState<'qr' | 'verify'>('qr');
  const [verifyCode, setVerifyCode] = useState('');

  /* --- Notifications --- */
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [marketingNotifs, setMarketingNotifs] = useState(false);

  /* --- Connected Accounts --- */
  const [googleConnected, setGoogleConnected] = useState(true);
  const [githubConnected, setGithubConnected] = useState(false);

  /* --- API Keys --- */
  const [apiKeys, setApiKeys] = useState(mockApiKeys);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');

  /* --- Sessions --- */
  const [sessions, setSessions] = useState(mockSessions);

  /* --- Delete Account --- */
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  /* --- Saving --- */
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1200);
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'security', label: 'Security' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'connections', label: 'Connections' },
    { id: 'api-keys', label: 'API Keys' },
    { id: 'sessions', label: 'Sessions' },
  ];

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      {/* Header */}
      <div className="bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Profile Settings</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
            Manage your Samya Web account and preferences
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Avatar Section */}
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700 p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {name.charAt(0)}
              </div>
              <button className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </button>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white">{name}</h2>
              <p className="text-sm text-surface-500 dark:text-surface-400">{email}</p>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline">Upload Photo</Button>
                <Button size="sm" variant="ghost">Remove</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden">
          <div className="px-6 pt-4">
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          </div>

          <div className="p-6">
            {/* ---------------------------------------------------------------- */}
            {/*  Personal Info Tab                                               */}
            {/* ---------------------------------------------------------------- */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
                  <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                  <Input label="Phone Number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" />
                  <Input label="Company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Your company name" />
                  <Input label="Website" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://yoursite.com" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-500 dark:text-surface-400 mb-1">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="builder-input w-full resize-none"
                    placeholder="Tell us about yourself..."
                  />
                  <p className="text-xs text-surface-400 mt-1">{bio.length}/250 characters</p>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/*  Security Tab                                                    */}
            {/* ---------------------------------------------------------------- */}
            {activeTab === 'security' && (
              <div className="space-y-8">
                {/* Password Change */}
                <div>
                  <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-4">Change Password</h3>
                  <div className="space-y-4 max-w-md">
                    <Input
                      label="Current Password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                    <Input
                      label="New Password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                    <Input
                      label="Confirm New Password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      error={confirmPassword && confirmPassword !== newPassword ? 'Passwords do not match' : undefined}
                    />
                    <Button size="sm" disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}>
                      Update Password
                    </Button>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="border-t border-surface-200 dark:border-surface-700 pt-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-surface-900 dark:text-white">Two-Factor Authentication</h3>
                      <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                        Add an extra layer of security to your account using an authenticator app.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={twoFactorEnabled ? 'success' : 'default'}>
                        {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                      <button
                        onClick={() => {
                          if (twoFactorEnabled) {
                            setTwoFactorEnabled(false);
                          } else {
                            setTwoFAStep('qr');
                            setVerifyCode('');
                            setShow2FAModal(true);
                          }
                        }}
                        className={cn(
                          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                          twoFactorEnabled ? 'bg-brand-600' : 'bg-surface-300 dark:bg-surface-600'
                        )}
                      >
                        <span
                          className={cn(
                            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                            twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                          )}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="border-t border-surface-200 dark:border-surface-700 pt-8">
                  <h3 className="text-base font-semibold text-red-600 mb-2">Danger Zone</h3>
                  <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>
                    Delete Account
                  </Button>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/*  Notifications Tab                                               */}
            {/* ---------------------------------------------------------------- */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  Choose how and when you want to be notified.
                </p>

                {[
                  {
                    label: 'Email Notifications',
                    description: 'Receive important updates, security alerts, and activity summaries via email.',
                    checked: emailNotifs,
                    onChange: setEmailNotifs,
                  },
                  {
                    label: 'Push Notifications',
                    description: 'Get real-time browser notifications for site activity and deployment status.',
                    checked: pushNotifs,
                    onChange: setPushNotifs,
                  },
                  {
                    label: 'Marketing Emails',
                    description: 'Stay informed about new features, tips, and promotional offers from Samya Web.',
                    checked: marketingNotifs,
                    onChange: setMarketingNotifs,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start justify-between p-4 rounded-xl border border-surface-200 dark:border-surface-700"
                  >
                    <div>
                      <h4 className="text-sm font-medium text-surface-900 dark:text-white">{item.label}</h4>
                      <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">{item.description}</p>
                    </div>
                    <button
                      onClick={() => item.onChange(!item.checked)}
                      className={cn(
                        'relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors',
                        item.checked ? 'bg-brand-600' : 'bg-surface-300 dark:bg-surface-600'
                      )}
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          item.checked ? 'translate-x-6' : 'translate-x-1'
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/*  Connections Tab                                                  */}
            {/* ---------------------------------------------------------------- */}
            {activeTab === 'connections' && (
              <div className="space-y-4">
                <p className="text-sm text-surface-500 dark:text-surface-400 mb-2">
                  Link third-party accounts for single sign-on and enhanced integrations.
                </p>

                {/* Google */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-surface-200 dark:border-surface-700">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white border border-surface-200 flex items-center justify-center">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-surface-900 dark:text-white">Google</h4>
                      <p className="text-xs text-surface-500 dark:text-surface-400">
                        {googleConnected ? 'Connected as alex@gmail.com' : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={googleConnected ? 'outline' : 'primary'}
                    onClick={() => setGoogleConnected(!googleConnected)}
                  >
                    {googleConnected ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>

                {/* GitHub */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-surface-200 dark:border-surface-700">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-surface-900 dark:bg-white flex items-center justify-center">
                      <svg className="w-5 h-5 text-white dark:text-surface-900" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-surface-900 dark:text-white">GitHub</h4>
                      <p className="text-xs text-surface-500 dark:text-surface-400">
                        {githubConnected ? 'Connected as @alexjohnson' : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={githubConnected ? 'outline' : 'primary'}
                    onClick={() => setGithubConnected(!githubConnected)}
                  >
                    {githubConnected ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/*  API Keys Tab                                                    */}
            {/* ---------------------------------------------------------------- */}
            {activeTab === 'api-keys' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-surface-900 dark:text-white">API Keys</h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                      Manage API keys for programmatic access to the Samya Web platform.
                    </p>
                  </div>
                  <Button size="sm" onClick={() => { setNewKeyName(''); setShowNewKeyModal(true); }}>
                    Generate New Key
                  </Button>
                </div>

                <div className="border border-surface-200 dark:border-surface-700 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-surface-50 dark:bg-surface-800 text-left">
                        <th className="px-4 py-3 font-medium text-surface-500 dark:text-surface-400">Name</th>
                        <th className="px-4 py-3 font-medium text-surface-500 dark:text-surface-400">Key</th>
                        <th className="px-4 py-3 font-medium text-surface-500 dark:text-surface-400">Created</th>
                        <th className="px-4 py-3 font-medium text-surface-500 dark:text-surface-400">Last Used</th>
                        <th className="px-4 py-3 font-medium text-surface-500 dark:text-surface-400" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
                      {apiKeys.map((key) => (
                        <tr key={key.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50">
                          <td className="px-4 py-3 font-medium text-surface-900 dark:text-white">{key.name}</td>
                          <td className="px-4 py-3">
                            <code className="text-xs bg-surface-100 dark:bg-surface-800 px-2 py-1 rounded font-mono text-surface-600 dark:text-surface-400">
                              {key.prefix}
                            </code>
                          </td>
                          <td className="px-4 py-3 text-surface-500 dark:text-surface-400">{key.createdAt}</td>
                          <td className="px-4 py-3 text-surface-500 dark:text-surface-400">{key.lastUsed}</td>
                          <td className="px-4 py-3 text-right">
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => setApiKeys(apiKeys.filter((k) => k.id !== key.id))}
                            >
                              Revoke
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {apiKeys.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-surface-400">
                            No API keys generated yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/*  Sessions Tab                                                    */}
            {/* ---------------------------------------------------------------- */}
            {activeTab === 'sessions' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-surface-900 dark:text-white">Active Sessions</h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                      Devices and browsers that are currently signed in to your account.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSessions(sessions.filter((s) => s.current))}
                  >
                    Revoke All Other Sessions
                  </Button>
                </div>

                <div className="space-y-3">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className={cn(
                        'flex items-center justify-between p-4 rounded-xl border',
                        session.current
                          ? 'border-brand-200 bg-brand-50/50 dark:border-brand-800 dark:bg-brand-900/10'
                          : 'border-surface-200 dark:border-surface-700'
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
                          <svg className="w-5 h-5 text-surface-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="3" width="20" height="14" rx="2" />
                            <path d="M8 21h8M12 17v4" />
                          </svg>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium text-surface-900 dark:text-white">{session.device}</h4>
                            {session.current && <Badge variant="success">Current</Badge>}
                          </div>
                          <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                            {session.ip} &middot; {session.location} &middot; Last active {session.lastActive}
                          </p>
                        </div>
                      </div>
                      {!session.current && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSessions(sessions.filter((s) => s.id !== session.id))}
                        >
                          Revoke
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="px-6 py-4 border-t border-surface-200 dark:border-surface-700 flex justify-end">
            <Button loading={saving} onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/*  2FA Setup Modal                                                     */}
      {/* -------------------------------------------------------------------- */}
      <Modal isOpen={show2FAModal} onClose={() => setShow2FAModal(false)} title="Set Up Two-Factor Authentication" size="md">
        {twoFAStep === 'qr' && (
          <div className="space-y-6">
            <p className="text-sm text-surface-600 dark:text-surface-400">
              Scan the QR code below with your authenticator app (Google Authenticator, Authy, etc.).
            </p>
            <div className="flex justify-center">
              <div className="w-48 h-48 bg-surface-100 dark:bg-surface-800 rounded-xl border-2 border-dashed border-surface-300 dark:border-surface-600 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-12 h-12 text-surface-400 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="3" height="3" />
                    <rect x="18" y="18" width="3" height="3" />
                  </svg>
                  <span className="text-xs text-surface-400">QR Code</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-surface-500 dark:text-surface-400 mb-1">Or enter this secret key manually:</p>
              <code className="block text-sm bg-surface-100 dark:bg-surface-800 px-3 py-2 rounded-lg font-mono text-surface-700 dark:text-surface-300 select-all text-center">
                JBSW Y3DP EHPK 3PXP
              </code>
            </div>
            <Button className="w-full" onClick={() => setTwoFAStep('verify')}>
              Continue
            </Button>
          </div>
        )}
        {twoFAStep === 'verify' && (
          <div className="space-y-6">
            <p className="text-sm text-surface-600 dark:text-surface-400">
              Enter the 6-digit code from your authenticator app to confirm setup.
            </p>
            <Input
              label="Verification Code"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value)}
              placeholder="000000"
              className="text-center text-lg tracking-widest"
              maxLength={6}
            />
            <Button
              className="w-full"
              disabled={verifyCode.length !== 6}
              onClick={() => {
                setTwoFactorEnabled(true);
                setShow2FAModal(false);
              }}
            >
              Verify & Enable
            </Button>
          </div>
        )}
      </Modal>

      {/* -------------------------------------------------------------------- */}
      {/*  New API Key Modal                                                   */}
      {/* -------------------------------------------------------------------- */}
      <Modal isOpen={showNewKeyModal} onClose={() => setShowNewKeyModal(false)} title="Generate API Key" size="sm">
        <div className="space-y-4">
          <Input
            label="Key Name"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="e.g. Production API Key"
          />
          <Button
            className="w-full"
            disabled={!newKeyName.trim()}
            onClick={() => {
              const id = `key_${Date.now()}`;
              setApiKeys([
                ...apiKeys,
                {
                  id,
                  name: newKeyName.trim(),
                  prefix: `sk_live_...${Math.random().toString(36).slice(-4)}`,
                  createdAt: new Date().toISOString().split('T')[0],
                  lastUsed: 'Never',
                },
              ]);
              setShowNewKeyModal(false);
            }}
          >
            Generate Key
          </Button>
        </div>
      </Modal>

      {/* -------------------------------------------------------------------- */}
      {/*  Delete Account Modal                                                */}
      {/* -------------------------------------------------------------------- */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Account" size="sm">
        <div className="space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
            <p className="text-sm text-red-700 dark:text-red-400 font-medium">
              This action is permanent and cannot be undone. All your sites, data, and configurations will be permanently deleted.
            </p>
          </div>
          <Input
            label='Type "DELETE" to confirm'
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder="DELETE"
          />
          <Button variant="danger" className="w-full" disabled={deleteConfirm !== 'DELETE'}>
            Permanently Delete Account
          </Button>
        </div>
      </Modal>
    </div>
  );
}
