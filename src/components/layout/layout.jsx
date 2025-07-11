import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher';
import { useEffect, useState } from 'react';
import { supabase } from '../../backend/supabaseClient';

const Layout = () => {
    const { t } = useTranslation();
    const [user, setUser] = useState(null);
    const [dropdown, setDropdown] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let ignore = false;
        async function syncUserToProfileTable(user) {
            if (!user) return;
            const { id, email, user_metadata } = user;
            if (!id || !email) {
                console.error('[SYNC USER] Thiếu thông tin id hoặc email:', { id, email });
                return;
            }
            // Kiểm tra đã có user trong bảng users chưa
            const { data: existed, error: checkError } = await supabase.from('users').select('id').eq('id', id).single();
            if (checkError && checkError.code !== 'PGRST116') { // PGRST116: no rows found
                console.error('[SYNC USER] Lỗi khi kiểm tra user:', checkError);
                return;
            }
            if (!existed) {
                // Nếu chưa có thì insert
                const { error: insertError } = await supabase.from('users').insert([
                    {
                        id,
                        email,
                        username: email,
                        display_name: user_metadata?.full_name || email || 'User',
                        avatar_url: user_metadata?.avatar_url || null
                    }
                ]);
                if (insertError) {
                    console.error('[SYNC USER] Lỗi khi insert user:', insertError);
                } else {
                    console.log('[SYNC USER] Đã insert user mới:', { id, email });
                }
            } else {
                console.log('[SYNC USER] User đã tồn tại:', { id, email });
            }
        }
        supabase.auth.getUser().then(({ data }) => {
            if (!ignore) {
                setUser(data?.user || null);
                syncUserToProfileTable(data?.user);
            }
        });
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
            syncUserToProfileTable(session?.user);
        });
        return () => {
            ignore = true;
            listener?.subscription.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setDropdown(false);
        navigate('/');
    };
    return (
        <div className="min-h-screen flex flex-col bg-gray-200 transition-colors duration-300">
            {/* Navbar */}
            <header className="bg-white shadow px-4 py-2 flex items-center justify-between transition-colors duration-300">
                <div className="flex items-center gap-4">
                    <span className="font-bold text-xl text-blue-600">{t('appName')}</span>
                    <nav className="hidden md:flex gap-4">
                        <Link to="/">{t('home')}</Link>
                        <Link to="/friends">{t('friends')}</Link>
                        <Link to="/groups">{t('groups')}</Link>
                        <Link to="/messages">{t('messages')}</Link>
                        <Link to="/settings">{t('settings')}</Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4 relative">
                    <LanguageSwitcher />
                    {user ? (
                        <>
                            <button onClick={() => setDropdown(v => !v)} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100">
                                <img src={user.user_metadata?.avatar_url || 'https://ui-avatars.com/api/?name=' + (user.email || 'U') + '&background=0D8ABC&color=fff&size=32'} alt="avatar" className="w-5 h-5 rounded-full border" />
                                <span className="font-semibold">{user.email}</span>
                            </button>
                            {dropdown && (
                                <div className="absolute right-0 top-12 bg-white shadow-lg rounded border w-48 z-50">
                                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">{t('profile')}</Link>
                                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">{t('logout')}</button>
                                </div>
                            )}
                        </>
                    ) : (
                        <Link to="/auth" className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold">
                            {t('login')}
                        </Link>
                    )}
                </div>
            </header>

            <div className="app-container flex-1">
                <main className="app-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;