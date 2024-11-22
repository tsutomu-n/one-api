import React, { useContext, useEffect, useState } from 'react';
import { Button, Divider, Form, Grid, Header, Image, Message, Modal, Segment } from 'semantic-ui-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { UserContext } from '../context/User';
import { API, getLogo, showError, showSuccess, showWarning } from '../helpers';
import { onGitHubOAuthClicked, onLarkOAuthClicked } from './utils';
import larkIcon from '../images/lark.svg';

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
    }
  }, []);

  const [showWeChatLoginModal, setShowWeChatLoginModal] = useState(false);

  const onWeChatLoginClicked = () => {
    setShowWeChatLoginModal(true);
  };

  const onSubmitWeChatVerificationCode = async () => {
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

  function handleChange(e) {
    const { name, value } = e.target;
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }

  async function handleSubmit(e) {
    setSubmitted(true);
    if (username && password) {
      const res = await API.post(`/api/user/login`, {
        username,
        password
      });
      const { success, message, data } = res.data;
      if (success) {
        userDispatch({ type: 'login', payload: data });
        localStorage.setItem('user', JSON.stringify(data));
        if (username === 'root' && password === '123456') {
          navigate('/user/edit');
          showSuccess('ログインに成功しました！');
          showWarning('请立刻修改デフォルトパスワード！');
        } else {
          navigate('/token');
          showSuccess('ログインに成功しました！');
        }
      } else {
        showError(message);
      }
    }
  }

  return (
    <Grid textAlign='center' style={{ marginTop: '48px' }}>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='' textAlign='center'>
          <Image src={logo} /> ユーザーログイン
        </Header>
        <Form size='large'>
          <Segment>
            <Form.Input
              fluid
              icon='user'
              iconPosition='left'
              placeholder='ユーザー名 / メールアドレス'
              name='username'
              value={username}
              onChange={handleChange}
            />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='パスワード'
              name='password'
              type='password'
              value={password}
              onChange={handleChange}
            />
            <Button color='green' fluid size='large' onClick={handleSubmit}>
              ログイン
            </Button>
          </Segment>
        </Form>
        <Message>
          パスワードをお忘れですか？
          <Link to='/reset' className='btn btn-link'>
            クリックしてリセット
          </Link>
          ； アカウントをお持ちではありませんか？
          <Link to='/register' className='btn btn-link'>
            クリックして登録
          </Link>
        </Message>
        {status.github_oauth || status.wechat_login || status.lark_client_id ? (
          <>
            <Divider horizontal>Or</Divider>
            <div style={{ display: "flex", justifyContent: "center" }}>
              {status.github_oauth ? (
                <Button
                  circular
                  color='black'
                  icon='github'
                  onClick={() => onGitHubOAuthClicked(status.github_client_id)}
                />
              ) : (
                <></>
              )}
              {status.wechat_login ? (
                <Button
                  circular
                  color='green'
                  icon='wechat'
                  onClick={onWeChatLoginClicked}
                />
              ) : (
                <></>
              )}
              {status.lark_client_id ? (
                <div style={{
                  background: "radial-gradient(circle, #FFFFFF, #FFFFFF, #00D6B9, #2F73FF, #0a3A9C)",
                  width: "36px",
                  height: "36px",
                  borderRadius: "10em",
                  display: "flex",
                  cursor: "pointer"
                }}
                  onClick={() => onLarkOAuthClicked(status.lark_client_id)}
                >
                  <Image
                    src={larkIcon}
                    avatar
                    style={{ width: "16px", height: "16px", cursor: "pointer", margin: "auto" }}
                    onClick={() => onLarkOAuthClicked(status.lark_client_id)}
                  />
                </div>
              ) : (
                <></>
              )}
            </div>
          </>
        ) : (
          <></>
        )}
        <Modal
          onClose={() => setShowWeChatLoginModal(false)}
          onOpen={() => setShowWeChatLoginModal(true)}
          open={showWeChatLoginModal}
          size={'mini'}
        >
          <Modal.Content>
            <Modal.Description>
              <Image src={status.wechat_qrcode} fluid />
              <div style={{ textAlign: 'center' }}>
                <p>
                  WeChatのQRコードをスキャンして公式アカウントをフォローし、「確認コード」と入力して確認コードを取得します（3分間有効）
                </p>
              </div>
              <Form size='large'>
                <Form.Input
                  fluid
                  placeholder='確認コード'
                  name='wechat_verification_code'
                  value={inputs.wechat_verification_code}
                  onChange={handleChange}
                />
                <Button
                  color=''
                  fluid
                  size='large'
                  onClick={onSubmitWeChatVerificationCode}
                >
                  ログイン
                </Button>
              </Form>
            </Modal.Description>
          </Modal.Content>
        </Modal>
      </Grid.Column>
    </Grid>
  );
};

export default LoginForm;
