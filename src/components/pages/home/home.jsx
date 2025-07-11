import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import PostForm from './PostForm';
import PostList from './PostList';
import { supabase } from '../../../backend/supabaseClient';

const Home = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [reloadPosts, setReloadPosts] = useState(0);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user || null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => listener?.subscription.unsubscribe();
  }, []);

  return (
    <div className="home-page min-h-screen flex flex-col items-center justify-center p-4 bg-gray-200 dark:bg-black transition-colors duration-300">
      {/* Nội dung chính */}
      <div className="z-10 max-w-5xl w-full mx-auto">
        {/* Slogan lớn ở trên */}
        <div className="text-center mb-2 transition-all duration-500 transform">
          <h1
            className="font-semibold mb-1 tracking-tight"
            style={{ fontSize: '48px', lineHeight: '1.1' }}
          >
            {t('home_feed')}
          </h1>
        </div>
        {/* Nội dung feed */}
        <div className="max-w-xl mx-auto py-2 px-2">
          {user && <PostForm user={user} onPostCreated={() => setReloadPosts(r => r + 1)} />}
          <PostList reloadPosts={reloadPosts} />
        </div>
      </div>
    </div>
  );
};

export default Home;