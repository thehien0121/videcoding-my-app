import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../../backend/supabaseClient';

const PostForm = ({ user, onPostCreated }) => {
  const { t } = useTranslation();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError(t('post_required'));
      return;
    }
    setError('');
    setLoading(true);
    const { data, error } = await supabase.from('posts').insert([{
      content,
      user_name: user?.user_metadata?.full_name || user?.email || 'Ẩn danh',
      user_id: user?.id || null
    }]);
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setContent('');
      onPostCreated && onPostCreated();
    }
  };

  return (
    <form className="bg-white rounded-2xl shadow-md p-5 mb-6 flex flex-col gap-2" onSubmit={handleSubmit}>
      <div className="flex items-center gap-3 mb-2">
        <img src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff&size=40" alt="avatar" className="w-8 h-8 rounded-full" />
        <div className="flex-1">
          <input
            className="w-full bg-gray-100 rounded-full px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
            placeholder={t('whats_on_your_mind')}
            value={content}
            onChange={e => setContent(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>
      {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
      <div className="flex items-center justify-between mt-2">
        <div className="flex gap-2">
          <button type="button" className="flex items-center gap-1 text-blue-600 hover:bg-blue-50 rounded px-2 py-1 text-sm" disabled>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 16.5V19a2 2 0 002 2h12a2 2 0 002-2v-2.5"/><path d="M4 12V7a2 2 0 012-2h12a2 2 0 012 2v5"/><path d="M16 13a4 4 0 01-8 0"/></svg>
            <span className="hidden sm:inline">{t('photo_video') || 'Photo/Video'}</span>
          </button>
          <button type="button" className="flex items-center gap-1 text-green-600 hover:bg-green-50 rounded px-2 py-1 text-sm" disabled>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            <span className="hidden sm:inline">{t('live') || 'Live'}</span>
          </button>
        </div>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full shadow transition-all disabled:opacity-60" disabled={loading || !content.trim()}>
          {loading ? t('posting') : t('post')}
        </button>
      </div>
    </form>
  );
};

export default PostForm;
