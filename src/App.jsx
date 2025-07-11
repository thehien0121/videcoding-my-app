import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/layout';
import Home from './components/pages/home/home';
import UserList from './components/pages/user/list';
import AuthPage from './components/pages/auth/AuthPage';
// import './App.css';
import './index.css';
import Friends from './components/pages/friends/Friends';
import GroupsList from './components/pages/groups/GroupsList';
import GroupCreate from './components/pages/groups/GroupCreate';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="user/list" element={<UserList />} />
          <Route path="friends" element={<Friends />} />
          <Route path="/groups" element={<GroupsList />} />
          <Route path="/groups/create" element={<GroupCreate />} />
          {/* Add more routes as needed */}
          <Route path="*" element={<div>Page not found</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
