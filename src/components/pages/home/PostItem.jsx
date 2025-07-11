import { useTranslation } from 'react-i18next';

const PostItem = ({ post }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 mb-4 border border-gray-100 flex flex-col">
      <div className="flex items-center gap-3 mb-2">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.user_name || 'User')}&background=0D8ABC&color=fff&size=40`}
          alt="avatar"
          className="w-8 h-8 rounded-full"
        />
        <div className="flex-1">
          <span className="font-semibold text-gray-900">{post.user_name || t('anonymous')}</span>
          <span className="block text-xs text-gray-400">{new Date(post.created_at).toLocaleString()}</span>
        </div>
      </div>
      <div className="text-gray-800 mb-3 ml-1" style={{wordBreak:'break-word'}}>{post.content}</div>
      <div className="flex gap-4 mt-2 border-t pt-2">
        <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 font-semibold px-2 py-1 rounded transition-all" disabled>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 00-6 0v4"/><path d="M5 15a7 7 0 0014 0v-2a2 2 0 00-2-2H7a2 2 0 00-2 2v2z"/></svg>
          {t('like')}
        </button>
        <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 font-semibold px-2 py-1 rounded transition-all" disabled>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h12a2 2 0 012 2z"/></svg>
          {t('comment')}
        </button>
      </div>
    </div>
  );
};

export default PostItem;
