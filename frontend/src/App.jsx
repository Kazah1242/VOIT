import { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import LoginForm from './components/Auth/LoginForm';
import VoteList from './components/votes/VoteList';
import './styles/App.scss';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Provider store={store}>
      <div className="app">
        <div className="container">
          <header className="app-header">
            <h1>Приложение для голосования</h1>
            {isAuthenticated && (
              <button 
                className="logout-btn"
                onClick={handleLogout}
              >
                Выйти
              </button>
            )}
          </header>
          
          {!isAuthenticated ? (
            <LoginForm onLogin={() => setIsAuthenticated(true)} />
          ) : (
            <VoteList />
          )}
        </div>
      </div>
    </Provider>
  );
}

export default App;
