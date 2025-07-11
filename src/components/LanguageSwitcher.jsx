import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-switcher flex gap-2 items-center">
      <button
        onClick={() => changeLanguage('vi')}
        className={`px-2 py-1 rounded ${i18n.language === 'vi' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        VI
      </button>
      <button
        onClick={() => changeLanguage('th')}
        className={`px-2 py-1 rounded ${i18n.language === 'th' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        TH
      </button>
    </div>
  );
};

export default LanguageSwitcher;
