import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { signUpWithEmail } from '../../../backend/auth';
import Toast from '../../Toast';

const Register = ({ onSwitchToLogin }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError(t('email') + ', ' + t('password') + ' ' + t('required'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('password') + ' ' + t('not_match'));
      return;
    }
    setError('');
    setLoading(true);
    const { error } = await signUpWithEmail(email, password);
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setToast(t('register_success') || 'Đăng ký thành công!');
      setTimeout(() => {
        setToast('');
        onSwitchToLogin();
      }, 1800);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Toast message={toast} onClose={() => setToast('')} />
      <form className="bg-white rounded shadow-md p-8 w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-center">{t('register')}</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">{t('email')}</label>
          <input type="email" className="w-full border rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">{t('password')}</label>
          <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">{t('confirm_password')}</label>
          <input type="password" className="w-full border rounded px-3 py-2" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-2" disabled={loading}>
          {loading ? t('registering') || '...' : t('register')}
        </button>
        <div className="text-center">
          <span>{t('have_account')} </span>
          <button type="button" className="text-blue-600 underline" onClick={onSwitchToLogin}>{t('login')}</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
