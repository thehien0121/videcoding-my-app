import { useState, useEffect } from 'react';
import { getMyGroups, getSuggestedGroups, searchGroups, joinGroup, leaveGroup } from '../../../backend/groups';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../LanguageSwitcher';

const USER_ID = '00000000-0000-0000-0000-000000000001'; // TODO: Replace with real user

const GroupsList = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState('my');
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  // Refetch all tab data
  const fetchGroups = async (activeTab = tab) => {
    setLoading(true);
    if (activeTab === 'my') {
      const data = await getMyGroups(USER_ID);
      setGroups(data);
    } else if (activeTab === 'suggested') {
      const data = await getSuggestedGroups(USER_ID);
      setGroups(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGroups(tab);
    // Nếu đang ở tab search, clear kết quả cũ
    if (tab === 'search') setSearchResults([]);
  }, [tab]);

  // Tìm kiếm nhóm
  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    try {
      const results = await searchGroups(search, USER_ID);
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    }
    setSearching(false);
  };

  // Sau khi join/leave, luôn reload lại data 2 tab + search nếu đang mở
  // Sau khi join/leave, chỉ reload lại tab hiện tại
  const reloadCurrentTab = async () => {
    if (tab === 'my' || tab === 'suggested') {
      await fetchGroups(tab);
    }
    if (tab === 'search' && search.trim()) {
      setSearching(true);
      try {
        const results = await searchGroups(search, USER_ID);
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      }
      setSearching(false);
    }
  };

  const handleJoin = async (groupId) => {
    await joinGroup(USER_ID, groupId);
    await reloadCurrentTab();
  };
  const handleLeave = async (groupId) => {
    await leaveGroup(USER_ID, groupId);
    await reloadCurrentTab();
  };



  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('groups.title', 'Nhóm')}</h1>
        <LanguageSwitcher />
      </div>
      <div className="flex space-x-4 mb-4">
        <button className={`px-4 py-2 rounded ${tab==='my' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`} onClick={()=>setTab('my')}>
          {t('groups.myGroups', 'Nhóm của bạn')}
        </button>
        <button className={`px-4 py-2 rounded ${tab==='suggested' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`} onClick={()=>setTab('suggested')}>
          {t('groups.suggested', 'Khám phá')}
        </button>
        <button className={`px-4 py-2 rounded ${tab==='search' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`} onClick={()=>setTab('search')}>
          {t('groups.search', 'Tìm kiếm')}
        </button>
        <a href="/groups/create" className="ml-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">{t('groups.create', 'Tạo nhóm mới')}</a>
      </div>
      {tab === 'search' && (
        <form className="flex mb-4" onSubmit={handleSearch}>
          <input
            className="flex-1 border border-gray-300 rounded-l px-4 py-2 focus:outline-none"
            type="text"
            placeholder={t('groups.searchPlaceholder', 'Nhập tên nhóm...')}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600" type="submit" disabled={searching}>
            {t('groups.searchBtn', 'Tìm kiếm')}
          </button>
        </form>
      )}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {loading || searching ? (
          <p className="text-gray-400">{t('loading', 'Đang tải...')}</p>
        ) : (tab === 'search' ? searchResults : groups).length === 0 ? (
          <p className="text-gray-500">{t('groups.noResults', 'Không có nhóm nào.')}</p>
        ) : (tab === 'search' ? searchResults : groups).map(group => (
          <div key={group.id} className="bg-white rounded-lg p-4 flex flex-col items-center shadow hover:shadow-md transition">
            <img src={group.cover_image || 'https://placehold.co/320x120?text=Group'} alt={group.name} className="w-full h-24 object-cover rounded mb-2" />
            <div className="font-semibold text-lg mb-1">{group.name}</div>
            <div className="text-sm text-gray-500 mb-2">{group.member_count || 0} {t('groups.members', 'thành viên')}</div>
            <div className="flex space-x-2 mt-2">
              {group.joined ? (
                <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm" onClick={()=>handleLeave(group.id)}>{t('groups.leave', 'Rời nhóm')}</button>
              ) : (
                <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm" onClick={()=>handleJoin(group.id)}>{t('groups.join', 'Tham gia')}</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupsList;
