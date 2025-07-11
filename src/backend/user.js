// Fake user data
const users = [
    { id: 1, name: 'Thế hiển', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Manager' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'User' },
];

// Simulate API call to fetch users with a delay
export const fetchUsers = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(users);
        }, 500); // Simulate network delay
    });
};

// Simulate getting a single user
export const fetchUserById = (id) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = users.find(user => user.id === id);
            if (user) {
                resolve(user);
            } else {
                reject(new Error('User not found'));
            }
        }, 500);
    });
}; 