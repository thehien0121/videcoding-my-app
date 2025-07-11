import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGroup } from '../../../backend/groups';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../LanguageSwitcher';

const USER_ID = '00000000-0000-0000-0000-000000000001'; // TODO: replace with real user

const GroupCreate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [coverImage, setCoverImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const group = await createGroup({
        name,
        description,
        privacy,
        cover_image: coverImage,
        created_by: USER_ID,
      });
      // Sau khi tạo, tự động join nhóm
      navigate('/groups');
    } catch (err) {
      setError(t('group_create.error'));
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{t('group_create.title')}</h2>
        <LanguageSwitcher />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">{t('group_create.name')}</label>
          <input type="text" className="w-full border rounded px-3 py-2" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label className="block font-medium mb-1">{t('group_create.description')}</label>
          <textarea className="w-full border rounded px-3 py-2" value={description} onChange={e => setDescription(e.target.value)} required />
        </div>
        <div>
          <label className="block font-medium mb-1">{t('group_create.privacy')}</label>
          <select className="w-full border rounded px-3 py-2" value={privacy} onChange={e => setPrivacy(e.target.value)}>
            <option value="public">{t('group_create.public')}</option>
            <option value="private">{t('group_create.private')}</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">{t('group_create.cover_image')}</label>
          <input type="text" className="w-full border rounded px-3 py-2" value={coverImage} onChange={e => setCoverImage(e.target.value)} placeholder="https://..." />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? t('group_create.creating') : t('group_create.create_btn')}
        </button>
      </form>
    </div>
  );
};

export default GroupCreate;
