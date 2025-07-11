import { useState } from 'react';
import Login from './Login';
import Register from './Register';
import LanguageSwitcher from '../../LanguageSwitcher';

const AuthPage = () => {
  const [mode, setMode] = useState('login');

  return (
    <div className="auth-page min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="w-full flex justify-end max-w-md mb-2">
        <div className="mr-2">
          {/* Language Switcher */}
          <LanguageSwitcher />
        </div>
      </div>
      {mode === 'login' ? (
        <Login onSwitchToRegister={() => setMode('register')} />
      ) : (
        <Register onSwitchToLogin={() => setMode('login')} />
      )}
    </div>
  );
};

export default AuthPage;
