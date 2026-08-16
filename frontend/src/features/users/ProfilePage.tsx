import { useEffect, useState, type FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { changePassword, updateProfile } from '../../features/auth/authSlice';
import { fa } from '../../shared/i18n/fa';
import { Alert } from '../../shared/ui/Alert';
import { Avatar } from '../../shared/ui/Avatar';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';
import { PageHeader } from '../../shared/ui/PageHeader';
import { Section } from '../../shared/ui/Section';

export function ProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [profile, setProfile] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setProfile({ firstName: user.firstName, lastName: user.lastName });
    }
  }, [user]);

  const onSaveProfile = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    const result = await dispatch(updateProfile(profile));
    if (updateProfile.fulfilled.match(result)) {
      setMessage('پروفایل ذخیره شد');
    } else {
      setError(result.error.message ?? fa.errorGeneric);
    }
  };

  const onChangePassword = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    const result = await dispatch(changePassword(passwords));
    if (changePassword.fulfilled.match(result)) {
      setMessage('رمز عبور تغییر کرد');
      setPasswords({ currentPassword: '', newPassword: '' });
    } else {
      setError(result.error.message ?? fa.errorGeneric);
    }
  };

  const displayName = `${profile.firstName} ${profile.lastName}`.trim() || user?.email || '?';

  return (
    <div>
      <PageHeader title={fa.profile} />
      {message && <Alert tone="success">{message}</Alert>}
      {error && <Alert>{error}</Alert>}

      <div className="mb-8 flex items-center gap-3">
        <Avatar name={displayName} />
        <div>
          <div className="font-medium">{displayName}</div>
          <div className="text-sm text-[var(--text-muted)]">{user?.email}</div>
        </div>
      </div>

      <Section title={fa.profile}>
        <form className="max-w-md space-y-3" onSubmit={onSaveProfile}>
          <Input
            label={fa.firstName}
            value={profile.firstName}
            onChange={(e) => setProfile((c) => ({ ...c, firstName: e.target.value }))}
          />
          <Input
            label={fa.lastName}
            value={profile.lastName}
            onChange={(e) => setProfile((c) => ({ ...c, lastName: e.target.value }))}
          />
          <Input label={fa.email} value={user?.email ?? ''} disabled />
          <Button type="submit">{fa.save}</Button>
        </form>
      </Section>

      <Section title={fa.changePassword}>
        <form className="max-w-md space-y-3" onSubmit={onChangePassword}>
          <Input
            label={fa.currentPassword}
            type="password"
            required
            value={passwords.currentPassword}
            onChange={(e) =>
              setPasswords((c) => ({ ...c, currentPassword: e.target.value }))
            }
          />
          <Input
            label={fa.newPassword}
            type="password"
            required
            minLength={8}
            hint="حداقل ۸ کاراکتر"
            value={passwords.newPassword}
            onChange={(e) =>
              setPasswords((c) => ({ ...c, newPassword: e.target.value }))
            }
          />
          <Button type="submit" variant="secondary">
            {fa.changePassword}
          </Button>
        </form>
      </Section>
    </div>
  );
}
