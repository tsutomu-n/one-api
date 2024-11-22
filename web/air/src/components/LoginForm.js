import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { UserContext } from '../context/User';
import { API, getLogo, showError, showInfo, showSuccess } from '../helpers';
import { onGitHubOAuthClicked } from './utils';
import Turnstile from 'react-turnstile';
import { Button, Card, Divider, Form, Icon, Layout, Modal } from '@douyinfe/semi-ui';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import Text from '@douyinfe/semi-ui/lib/es/typography/text';
import TelegramLoginButton from 'react-telegram-login';

import { IconGithubLogo } from '@douyinfe/semi-icons';
import WeChatIcon from './WeChatIcon';

const LoginForm = () => {
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
    wechat_verification_code: ''
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const { username, password } = inputs;
  const [userState, userDispatch] = useContext(UserContext);
  const [turnstileEnabled, setTurnstileEnabled] = useState(false);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  let navigate = useNavigate();
  const [status, setStatus] = useState({});
  const logo = getLogo();

  useEffect(() => {
    if (searchParams.get('expired')) {
      showError('ログインしていないか、ログインの有効期限が切れています。もう一度ログインしてください！');
    }
    let status = localStorage.getItem('status');
    if (status) {
      status = JSON.parse(status);
      setStatus(status);
      if (status.turnstile_check) {
        setTurnstileEnabled(true);
        setTurnstileSiteKey(status.turnstile_site_key);
      }
    }
  }, []);

  const [showWeChatLoginModal, setShowWeChatLoginModal] = useState(false);

  const onWeChatLoginClicked = () => {
    setShowWeChatLoginModal(true);
  };

  const onSubmitWeChatVerificationCode = async () => {
    if (turnstileEnabled && turnstileToken === '') {
      showInfo('数秒後にもう一度お試しください。Turnstileがユーザー環境を確認しています！');
      return;
    }
    const res = await API.get(
      `/api/oauth/wechat?code=${inputs.wechat_verification_code}`
    );
    const { success, message, data } = res.data;
    if (success) {
      userDispatch({ type: 'login', payload: data });
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/');
      showSuccess('ログインに成功しました！');
      setShowWeChatLoginModal(false);
    } else {
      showError(message);
    }
  };

  function handleChange(name, value) {
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }

  async function handleSubmit(e) {
    if (turnstileEnabled && turnstileToken === '') {
      showInfo('数秒後にもう一度お試しください。Turnstileがユーザー環境を確認しています！');
      return;
    }
    setSubmitted(true);
    if (username && password) {
      const res = await API.post(`/api/user/login?turnstile=${turnstileToken}`, {
        username,
        password
      });
      const { success, message, data } = res.data;
      if (success) {
        userDispatch({ type: 'login', payload: data });
        localStorage.setItem('user', JSON.stringify(data));
        showSuccess('ログインに成功しました！');
        if (username === 'root' && password === '123456') {
          Modal.error({ title: '您正在使用デフォルトパスワード！', content: '请立刻修改デフォルトパスワード！', centered: true });
        }
        navigate('/token');
      } else {
        showError(message);
      }
    } else {
      showError('ユーザー名を入力してください和パスワード！');
    }
  }

  // 添加Telegramログイン处理函数
  const onTelegramLoginClicked = async (response) => {
    const fields = ['id', 'first_name', 'last_name', 'username', 'photo_url', 'auth_date', 'hash', 'lang'];
    const params = {};
    fields.forEach((field) => {
      if (response[field]) {
        params[field] = response[field];
      }
    });
    const res = await API.get(`/api/oauth/telegram/login`, { params });
    const { success, message, data } = res.data;
    if (success) {
      userDispatch({ type: 'login', payload: data });
      localStorage.setItem('user', JSON.stringify(data));
      showSuccess('ログインに成功しました！');
      navigate('/');
    } else {
      showError(message);
    }
  };

  return (
    <div>
      <Layout>
        <Layout.Header>
        </Layout.Header>
        <Layout.Content>
          <div style={{ justifyContent: 'center', display: 'flex', marginTop: 120 }}>
            <div style={{ width: 500 }}>
              <Card>
                <Title heading={2} style={{ textAlign: 'center' }}>
                  ユーザーログイン
                </Title>
                <Form>
                  <Form.Input
                    field={'username'}
                    label={'ユーザー名'}
                    placeholder="ユーザー名"
                    name="username"
                    onChange={(value) => handleChange('username', value)}
                  />
                  <Form.Input
                    field={'password'}
                    label={'パスワード'}
                    placeholder="パスワード"
                    name="password"
                    type="password"
                    onChange={(value) => handleChange('password', value)}
                  />

                  <Button theme="solid" style={{ width: '100%' }} type={'primary'} size="large"
                          htmlType={'submit'} onClick={handleSubmit}>
                    ログイン
                  </Button>
                </Form>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
                  <Text>
                    没有账号请先 <Link to="/register">登録账号</Link>
                  </Text>
                  <Text>
                    忘记パスワード <Link to="/reset">クリックしてリセット</Link>
                  </Text>
                </div>
                {status.github_oauth || status.wechat_login || status.telegram_oauth ? (
                  <>
                    <Divider margin="12px" align="center">
                      第三方ログイン
                    </Divider>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                      {status.github_oauth ? (
                        <Button
                          type="primary"
                          icon={<IconGithubLogo />}
                          onClick={() => onGitHubOAuthClicked(status.github_client_id)}
                        />
                      ) : (
                        <></>
                      )}
                      {status.wechat_login ? (
                        <Button
                          type="primary"
                          style={{ color: 'rgba(var(--semi-green-5), 1)' }}
                          icon={<Icon svg={<WeChatIcon />} />}
                          onClick={onWeChatLoginClicked}
                        />
                      ) : (
                        <></>
                      )}

                      {status.telegram_oauth ? (
                        <TelegramLoginButton dataOnauth={onTelegramLoginClicked} botName={status.telegram_bot_name} />
                      ) : (
                        <></>
                      )}
                    </div>
                  </>
                ) : (
                  <></>
                )}
                <Modal
                  title="微信扫码ログイン"
                  visible={showWeChatLoginModal}
                  maskClosable={true}
                  onOk={onSubmitWeChatVerificationCode}
                  onCancel={() => setShowWeChatLoginModal(false)}
                  okText={'ログイン'}
                  size={'small'}
                  centered={true}
                >
                  <div style={{ display: 'flex', alignItem: 'center', flexDirection: 'column' }}>
                    <img src={status.wechat_qrcode} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p>
                      WeChatのQRコードをスキャンして公式アカウントをフォローし、「確認コード」と入力して確認コードを取得します（3分間有効）
                    </p>
                  </div>
                  <Form size="large">
                    <Form.Input
                      field={'wechat_verification_code'}
                      placeholder="確認コード"
                      label={'確認コード'}
                      value={inputs.wechat_verification_code}
                      onChange={(value) => handleChange('wechat_verification_code', value)}
                    />
                  </Form>
                </Modal>
              </Card>
              {turnstileEnabled ? (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                  <Turnstile
                    sitekey={turnstileSiteKey}
                    onVerify={(token) => {
                      setTurnstileToken(token);
                    }}
                  />
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>

        </Layout.Content>
      </Layout>
    </div>
  );
};

export default LoginForm;
