import { useState, useEffect } from 'react';
import { fetchUsers } from '../../../backend/user';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../LanguageSwitcher';

const UserList = () => {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortField, setSortField] = useState('id');
    const [sortDirection, setSortDirection] = useState('asc');

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoading(true);
                const data = await fetchUsers();
                setUsers(data);
                setError(null);
            } catch (err) {
                setError('Failed to load users. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, []);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortedUsers = [...users].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (sortDirection === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    if (loading) {
        return (
            <div className="user-list-page">
                <div className="flex justify-between items-center mb-4">
                    <h1>{t('userlist.title', 'Danh sách người dùng')}</h1>
                    <LanguageSwitcher />
                </div>
                <div>{t('userlist.loading', 'Đang tải người dùng...')}</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="user-list-page">
                <div className="flex justify-between items-center mb-4">
                    <h1>{t('userlist.title', 'Danh sách người dùng')}</h1>
                    <LanguageSwitcher />
                </div>
                <div className="error-message">{error}</div>
            </div>
        );
    }

    if (!users || users.length === 0) {
        return (
            <div className="user-list-page">
                <div className="flex justify-between items-center mb-4">
                    <h1>{t('userlist.title', 'Danh sách người dùng')}</h1>
                    <LanguageSwitcher />
                </div>
                <div>{t('userlist.no_users', 'Không tìm thấy người dùng nào.')}</div>
            </div>
        );
    }

    return (
        <div className="user-list-page">
            <div className="flex justify-between items-center mb-4">
                <h1>{t('userlist.title', 'Danh sách người dùng')}</h1>
                <LanguageSwitcher />
            </div>
            <div className="user-table-container">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('id')}>
                                {t('userlist.id', 'ID')} {sortField === 'id' && (sortDirection === 'asc' ? '▲' : '▼')}
                            </th>
                            <th onClick={() => handleSort('name')}>
                                {t('userlist.name', 'Tên')} {sortField === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}
                            </th>
                            <th onClick={() => handleSort('email')}>
                                {t('userlist.email', 'Email')} {sortField === 'email' && (sortDirection === 'asc' ? '▲' : '▼')}
                            </th>
                            <th onClick={() => handleSort('role')}>
                                {t('userlist.role', 'Vai trò')} {sortField === 'role' && (sortDirection === 'asc' ? '▲' : '▼')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedUsers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserList;