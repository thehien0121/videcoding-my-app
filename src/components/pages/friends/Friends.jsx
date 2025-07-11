import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../LanguageSwitcher';
import { getFriends, getFriendRequests, searchUsers, acceptFriendRequest, declineFriendRequest, removeFriend, sendFriendRequest } from '../../../backend/friends';

const USER_ID = '00000000-0000-0000-0000-000000000001'; // TODO: Replace with real user id from auth

const Tabs = [
  {
    key: 'all',
    label: 'friends_module.all',
    defaultText: 'Tất cả bạn bè',
    icon: <span className="mr-2">👥</span>,
  },
  {
    key: 'requests',
    label: 'friends_module.requests',
    defaultText: 'Lời mời kết bạn',
    icon: <span className="mr-2">🔒</span>,
  },
  {
    key: 'search',
    label: 'friends_module.search',
    defaultText: 'Tìm kiếm bạn bè',
    icon: <span className="mr-2">🔍</span>,
  },
];

const Friends = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  // Load friends & requests
  useEffect(() => {
    if (tab === 'all') {
      setLoading(true);
      getFriends(USER_ID)
        .then(setFriends)
        .catch(() => setFriends([]))
        .finally(() => setLoading(false));
    } else if (tab === 'requests') {
      setLoading(true);
      getFriendRequests(USER_ID)
        .then(setRequests)
        .catch(() => setRequests([]))
        .finally(() => setLoading(false));
    }
  }, [tab]);

  // Search friends
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    console.log('[SEARCH] Search input:', search);
    if (!search.trim()) {
      setSearchResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    try {
      const results = await searchUsers(search, USER_ID);
      console.log('[SEARCH] API results:', results);
      setSearchResults(results);
    } catch (err) {
      console.error('[SEARCH] Error:', err);
      setSearchResults([]);
    }
    setSearching(false);
  };

  // Friend actions
  const handleAccept = async (requestId, userId) => {
    await acceptFriendRequest(requestId);
    setRequests((prev) => prev.filter((r) => r.requestId !== requestId));
    setFriends((prev) => [...prev, searchResults.find(u => u.id === userId) || {}]);
  };
  const handleDecline = async (requestId) => {
    await declineFriendRequest(requestId);
    setRequests((prev) => prev.filter((r) => r.requestId !== requestId));
  };
  const handleRemove = async (friendId) => {
    await removeFriend(USER_ID, friendId);
    setFriends((prev) => prev.filter((f) => f.id !== friendId));
  };
  const handleSendRequest = async (userId) => {
    await sendFriendRequest(USER_ID, userId);
    setSearchResults((prev) => prev.map(u => u.id === userId ? { ...u, requested: true } : u));
  };
  const handleMessage = (friendId) => {
    alert(t('friends.messageFeature', 'Tính năng nhắn tin sẽ sớm ra mắt!'));
  };

  return (
    <div className="friends-container w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8 overflow-x-hidden">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{t('friends.title', 'Bạn bè')}</h1>
        <LanguageSwitcher />
      </div>
      <div className="flex border-b mb-6">
        {Tabs.map(tabItem => (
          <button
            key={tabItem.key}
            onClick={() => setTab(tabItem.key)}
            className={`flex items-center px-5 py-3 text-base font-medium focus:outline-none transition-all border-b-2 ${tab === tabItem.key ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}
          >
            {tabItem.icon}
            {t(tabItem.label, tabItem.defaultText)}
          </button>
        ))}
      </div>
      <div>
        {tab === 'all' && (
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {loading ? (
              <p className="text-gray-400">{t('loading', 'Đang tải...')}</p>
            ) : friends.length === 0 ? (
              <p className="text-gray-500">{t('friends.noFriends', 'Chưa có bạn bè nào.')}</p>
            ) : (
              friends.map(friend => {
                const displayName = friend.display_name || friend.name || 'Chưa có tên';
                const avatarUrl = friend.avatar_url || friend.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(displayName);
                return (
                  <div key={friend.id} className="friends-card bg-gray-50 rounded-lg p-4 flex flex-col items-center shadow hover:shadow-md transition">
                    <img src={avatarUrl} alt={displayName} className="w-20 h-20 rounded-full mb-2 border-2 border-blue-200 object-cover" />
                    <div className="font-semibold text-lg mb-1">{displayName}</div>
                    <div className="flex space-x-2 mt-2">
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                        onClick={() => handleMessage(friend.id)}
                      >
                        {t('friends.message', 'Nhắn tin')}
                      </button>
                      <button
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                        onClick={() => handleRemove(friend.id)}
                      >
                        {t('friends.remove', 'Xóa bạn')}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
        {tab === 'requests' && (
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {loading ? (
              <p className="text-gray-400">{t('loading', 'Đang tải...')}</p>
            ) : requests.length === 0 ? (
              <p className="text-gray-500">{t('friends.noRequests', 'Không có lời mời nào.')}</p>
            ) : (
              requests.map(req => {
                const displayName = req.display_name || req.name || 'Chưa có tên';
                const avatarUrl = req.avatar_url || req.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(displayName);
                return (
                  <div key={req.requestId} className="friends-card bg-white rounded-lg p-4 flex flex-col items-center shadow hover:shadow-md transition">
                    <img src={avatarUrl} alt={displayName} className="w-20 h-20 rounded-full mb-2 border-2 border-green-200 object-cover" />
                    <div className="font-semibold text-lg mb-1">{displayName}</div>
                    <div className="flex space-x-2 mt-2">
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                        onClick={() => handleAccept(req.requestId, req.id)}
                      >
                        {t('friends.accept', 'Chấp nhận')}
                      </button>
                      <button
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                        onClick={() => handleDecline(req.requestId)}
                      >
                        {t('friends.decline', 'Từ chối')}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
        {tab === 'search' && (
          <div>
            <form onSubmit={handleSearch} className="flex mb-6">
              <input
                className="flex-1 border border-gray-300 rounded-l px-4 py-2 focus:outline-none"
                type="text"
                placeholder={t('friends.searchPlaceholder', 'Nhập tên bạn bè...')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch(e);
                  }
                }}
              />
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
                type="submit"
                disabled={searching}
              >
                {t('friends.searchBtn', 'Tìm kiếm')}
              </button>
            </form>
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              {searching ? (
                <p className="text-gray-400">{t('loading', 'Đang tải...')}</p>
              ) : searchResults.length === 0 ? (
                <>
                  <p className="text-gray-500">{t('friends.noResults', 'Không tìm thấy kết quả.')}</p>
                  <pre className="text-xs text-gray-400 bg-gray-50 p-2 rounded mt-2">{JSON.stringify(searchResults, null, 2)}</pre>
                </>
              ) : (
                searchResults.map(user => {
                  const displayName = user.display_name || user.name || 'Chưa có tên';
                  const avatarUrl = user.avatar_url || user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(displayName);
                  return (
                    <div key={user.id} className="friends-card bg-white rounded-lg p-4 flex flex-col items-center shadow hover:shadow-md transition">
                      <img src={avatarUrl} alt={displayName} className="w-20 h-20 rounded-full mb-2 border-2 border-yellow-200 object-cover" />
                      <div className="font-semibold text-lg mb-1">{displayName}</div>
                      <div className="flex space-x-2 mt-2">
                        {user.isFriend ? (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm">{t('friends.isFriend', 'Đã là bạn bè')}</span>
                        ) : user.requested ? (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">{t('friends.requested', 'Đã gửi lời mời')}</span>
                        ) : (
                          <button
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                            onClick={() => handleSendRequest(user.id)}
                          >
                            {t('friends.add', 'Kết bạn')}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends;
