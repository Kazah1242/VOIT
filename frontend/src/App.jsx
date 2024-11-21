import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import LoginForm from './components/Auth/LoginForm.jsx';
import VoteList from './components/votes/VoteList';
import './styles/App.scss';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );
  const [userInfo, setUserInfo] = useState({
    name: localStorage.getItem('userName') || '',
    email: localStorage.getItem('userEmail') || ''
  });

  useEffect(() => {
    if (window.VK) {
      VK.init({
        apiId: 52725325
      });
    }
  }, []);

  const handleVKLogin = async () => {
    try {
      VK.init({
        apiId: 52725325
      });

      VK.Auth.login(async (response) => {
        if (response.status === 'connected') {
          console.log('VK Auth success:', response);
          
          const res = await fetch('http://localhost:5000/api/auth/vk-callback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              userId: response.session.mid,
              sessionId: response.session.sid
            })
          });

          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText);
          }

          const data = await res.json();
          localStorage.setItem('token', data.token);
          if (data.userName) {
            localStorage.setItem('userName', data.userName);
            setUserInfo(prev => ({ ...prev, name: data.userName }));
          }
          setIsAuthenticated(true);
        }
      }, VK.access.DEFAULT);
    } catch (error) {
      console.error('Auth Error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    setUserInfo({ name: '', email: '' });
    setIsAuthenticated(false);
  };

  return (
    <Provider store={store}>
      <div className="app">
        <div className="container">
          <header className="app-header">
            <h1>Приложение для голосования</h1>
            {isAuthenticated && (
              <div className="user-section">
                <span className="user-info">
                  {userInfo.name || userInfo.email}
                </span>
                <button className="logout-btn" onClick={handleLogout}>
                  Выйти
                </button>
              </div>
            )}
          </header>
          
          {!isAuthenticated ? (
            <div className="login-container">
              <LoginForm onLogin={() => setIsAuthenticated(true)} />
              <div className="vk-login">
                <button 
                  className="vk-auth-button"
                  onClick={handleVKLogin}
                >
                  Войти через VK
                </button>
              </div>
            </div>
          ) : (
            <VoteList />
          )}
        </div>
      </div>
    </Provider>
  );
}

export default App;
