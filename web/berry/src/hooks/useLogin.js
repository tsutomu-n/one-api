import { API } from 'utils/api';
import { useDispatch } from 'react-redux';
import { LOGIN } from 'store/actions';
import { useNavigate } from 'react-router';
import { showSuccess } from 'utils/common';

const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const login = async (username, password) => {
    try {
      const res = await API.post(`/api/user/login`, {
        username,
        password
      });
      const { success, message, data } = res.data;
      if (success) {
        localStorage.setItem('user', JSON.stringify(data));
        dispatch({ type: LOGIN, payload: data });
        navigate('/panel');
      }
      return { success, message };
    } catch (err) {
      // 请求失败，設定错误信息
      return { success: false, message: '' };
    }
  };

  const githubLogin = async (code, state) => {
    try {
      const res = await API.get(`/api/oauth/github?code=${code}&state=${state}`);
      const { success, message, data } = res.data;
      if (success) {
        if (message === 'bind') {
          showSuccess('紐付けに成功しました！');
          navigate('/panel');
        } else {
          dispatch({ type: LOGIN, payload: data });
          localStorage.setItem('user', JSON.stringify(data));
          showSuccess('ログインに成功しました！');
          navigate('/panel');
        }
      }
      return { success, message };
    } catch (err) {
      // 请求失败，設定错误信息
      return { success: false, message: '' };
    }
  };

  const larkLogin = async (code, state) => {
    try {
      const res = await API.get(`/api/oauth/lark?code=${code}&state=${state}`);
      const { success, message, data } = res.data;
      if (success) {
        if (message === 'bind') {
          showSuccess('紐付けに成功しました！');
          navigate('/panel');
        } else {
          dispatch({ type: LOGIN, payload: data });
          localStorage.setItem('user', JSON.stringify(data));
          showSuccess('ログインに成功しました！');
          navigate('/panel');
        }
      }
      return { success, message };
    } catch (err) {
      // 请求失败，設定错误信息
      return { success: false, message: '' };
    }
  };

  const oidcLogin = async (code, state) => {
    try {
      const res = await API.get(`/api/oauth/oidc?code=${code}&state=${state}`);
      const { success, message, data } = res.data;
      if (success) {
        if (message === 'bind') {
          showSuccess('紐付けに成功しました！');
          navigate('/panel');
        } else {
          dispatch({ type: LOGIN, payload: data });
          localStorage.setItem('user', JSON.stringify(data));
          showSuccess('ログインに成功しました！');
          navigate('/panel');
        }
      }
      return { success, message };
    } catch (err) {
      // 请求失败，設定错误信息
      return { success: false, message: '' };
    }
  }

  const wechatLogin = async (code) => {
    try {
      const res = await API.get(`/api/oauth/wechat?code=${code}`);
      const { success, message, data } = res.data;
      if (success) {
        dispatch({ type: LOGIN, payload: data });
        localStorage.setItem('user', JSON.stringify(data));
        showSuccess('ログインに成功しました！');
        navigate('/panel');
      }
      return { success, message };
    } catch (err) {
      // 请求失败，設定错误信息
      return { success: false, message: '' };
    }
  };

  const logout = async () => {
    await API.get('/api/user/logout');
    localStorage.removeItem('user');
    dispatch({ type: LOGIN, payload: null });
    navigate('/');
  };

  return { login, logout, githubLogin, wechatLogin, larkLogin,oidcLogin };
};

export default useLogin;
