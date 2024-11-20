import { useState } from 'react';
import { api } from '../../services/api';
import './LoginForm.scss';

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('email');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistration, setIsRegistration] = useState(false);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/request-code', { email });
      setMessage(response.data.message);
      if (response.data.isNewUser !== isRegistration) {
        setMessage(isRegistration 
          ? 'Этот email уже зарегистрирован. Выполняется вход.' 
          : 'Новый пользователь. Выполняется регистрация.'
        );
      }
      setStep('code');
    } catch (error) {
      setError(error.response?.data?.message || 'Ошибка отправки кода');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/verify-code', { email, code });
      localStorage.setItem('token', response.data.token);
      onLogin();
    } catch (error) {
      setError(error.response?.data?.message || 'Неверный код подтверждения');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistration(!isRegistration);
    setError('');
    setMessage('');
  };

  return (
    <div className="auth-form">
      {step === 'email' ? (
        <form onSubmit={handleRequestCode}>
          <h2>{isRegistration ? 'Регистрация' : 'Вход'}</h2>
          <p className="auth-form__info">
            {isRegistration 
              ? 'Создайте аккаунт, указав ваш email' 
              : 'Войдите, используя ваш email'
            }
          </p>
          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Введите ваш email"
              disabled={loading}
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
          >
            {loading ? 'Отправка...' : 'Получить код'}
          </button>
          <button 
            type="button" 
            className="btn-link" 
            onClick={toggleMode}
            disabled={loading}
          >
            {isRegistration 
              ? 'Уже есть аккаунт? Войти' 
              : 'Нет аккаунта? Зарегистрироваться'
            }
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode}>
          <h2>Подтверждение</h2>
          <p className="auth-form__info">
            Введите код, который мы отправили на {email}
          </p>
          <div className="form-group">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Введите код из email"
              disabled={loading}
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Проверка...' : 'Подтвердить'}
          </button>
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => {
              setStep('email');
              setCode('');
              setError('');
              setMessage('');
            }}
            disabled={loading}
          >
            Изменить email
          </button>
        </form>
      )}
      
      {error && <div className="alert error">{error}</div>}
      {message && <div className="alert success">{message}</div>}
    </div>
  );
}

export default LoginForm; 