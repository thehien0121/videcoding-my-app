import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../../backend/supabaseClient';
import PostItem from './PostItem';

const PostList = ({ reloadPosts }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    setPosts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
    // Realtime: subscribe to posts changes (optional)
    const channel = supabase.channel('public:posts').on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, fetchPosts).subscribe();
    return () => { channel.unsubscribe(); };
  }, [reloadPosts]);

  const { t } = useTranslation();
  if (loading) return <div className="flex justify-center py-10"><svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg></div>;
  if (!posts.length) return <div className="text-center py-10 text-gray-500">{t('no_posts')}</div>;
  return (
    <div className="flex flex-col gap-4">
      {posts.map(post => <PostItem key={post.id} post={post} />)}
    </div>
  );
};

export default PostList;
