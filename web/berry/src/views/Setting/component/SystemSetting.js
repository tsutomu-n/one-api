import { useState, useEffect } from 'react';
import SubCard from 'ui-component/cards/SubCard';
import {
  Stack,
  FormControl,
  InputLabel,
  OutlinedInput,
  Checkbox,
  Button,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Alert,
  Autocomplete,
  TextField
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { showError, showSuccess, removeTrailingSlash } from 'utils/common'; //,
import { API } from 'utils/api';
import { createFilterOptions } from '@mui/material/Autocomplete';

const filter = createFilterOptions();
const SystemSetting = () => {
  let [inputs, setInputs] = useState({
    PasswordLoginEnabled: '',
    PasswordRegisterEnabled: '',
    EmailVerificationEnabled: '',
    GitHubOAuthEnabled: '',
    GitHubClientId: '',
    GitHubClientSecret: '',
    LarkClientId: '',
    LarkClientSecret: '',
    OidcEnabled: '',
    OidcWellKnown: '',
    OidcClientId: '',
    OidcClientSecret: '',
    OidcAuthorizationEndpoint: '',
    OidcTokenEndpoint: '',
    OidcUserinfoEndpoint: '',
    Notice: '',
    SMTPServer: '',
    SMTPPort: '',
    SMTPAccount: '',
    SMTPFrom: '',
    SMTPToken: '',
    ServerAddress: '',
    Footer: '',
    WeChatAuthEnabled: '',
    WeChatServerAddress: '',
    WeChatServerToken: '',
    WeChatAccountQRCodeImageURL: '',
    TurnstileCheckEnabled: '',
    TurnstileSiteKey: '',
    TurnstileSecretKey: '',
    RegisterEnabled: '',
    EmailDomainRestrictionEnabled: '',
    EmailDomainWhitelist: [],
    MessagePusherAddress: '',
    MessagePusherToken: ''
  });
  const [originInputs, setOriginInputs] = useState({});
  let [loading, setLoading] = useState(false);
  const [EmailDomainWhitelist, setEmailDomainWhitelist] = useState([]);
  const [showPasswordWarningModal, setShowPasswordWarningModal] = useState(false);

  const getOptions = async () => {
    const res = await API.get('/api/option/');
    const { success, message, data } = res.data;
    if (success) {
      let newInputs = {};
      data.forEach((item) => {
        newInputs[item.key] = item.value;
      });
      setInputs({
        ...newInputs,
        EmailDomainWhitelist: newInputs.EmailDomainWhitelist.split(',')
      });
      setOriginInputs(newInputs);

      setEmailDomainWhitelist(newInputs.EmailDomainWhitelist.split(','));
    } else {
      showError(message);
    }
  };

  useEffect(() => {
    getOptions().then();
  }, []);

  const updateOption = async (key, value) => {
    setLoading(true);
    switch (key) {
      case 'PasswordLoginEnabled':
      case 'PasswordRegisterEnabled':
      case 'EmailVerificationEnabled':
      case 'GitHubOAuthEnabled':
      case 'WeChatAuthEnabled':
      case 'TurnstileCheckEnabled':
      case 'EmailDomainRestrictionEnabled':
      case 'RegisterEnabled':
      case 'OidcEnabled':
        value = inputs[key] === 'true' ? 'false' : 'true';
        break;
      default:
        break;
    }
    const res = await API.put('/api/option/', {
      key,
      value
    });
    const { success, message } = res.data;
    if (success) {
      if (key === 'EmailDomainWhitelist') {
        value = value.split(',');
      }
      setInputs((inputs) => ({
        ...inputs,
        [key]: value
      }));
      showSuccess('設定成功！');
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const handleInputChange = async (event) => {
    let { name, value } = event.target;

    if (name === 'PasswordLoginEnabled' && inputs[name] === 'true') {
      // block disabling password login
      setShowPasswordWarningModal(true);
      return;
    }
    if (
      name === 'Notice' ||
      name.startsWith('SMTP') ||
      name === 'ServerAddress' ||
      name === 'GitHubClientId' ||
      name === 'GitHubClientSecret' ||
      name === 'WeChatServerAddress' ||
      name === 'WeChatServerToken' ||
      name === 'WeChatAccountQRCodeImageURL' ||
      name === 'TurnstileSiteKey' ||
      name === 'TurnstileSecretKey' ||
      name === 'EmailDomainWhitelist' ||
      name === 'MessagePusherAddress' ||
      name === 'MessagePusherToken' ||
      name === 'LarkClientId' ||
      name === 'LarkClientSecret' ||
      name === 'OidcClientId' ||
      name === 'OidcClientSecret' ||
      name === 'OidcWellKnown' ||
      name === 'OidcAuthorizationEndpoint' ||
      name === 'OidcTokenEndpoint' ||
      name === 'OidcUserinfoEndpoint'
    )
    {
      setInputs((inputs) => ({ ...inputs, [name]: value }));
    } else {
      await updateOption(name, value);
    }
  };

  const submitServerAddress = async () => {
    let ServerAddress = removeTrailingSlash(inputs.ServerAddress);
    await updateOption('ServerAddress', ServerAddress);
  };

  const submitSMTP = async () => {
    if (originInputs['SMTPServer'] !== inputs.SMTPServer) {
      await updateOption('SMTPServer', inputs.SMTPServer);
    }
    if (originInputs['SMTPAccount'] !== inputs.SMTPAccount) {
      await updateOption('SMTPAccount', inputs.SMTPAccount);
    }
    if (originInputs['SMTPFrom'] !== inputs.SMTPFrom) {
      await updateOption('SMTPFrom', inputs.SMTPFrom);
    }
    if (originInputs['SMTPPort'] !== inputs.SMTPPort && inputs.SMTPPort !== '') {
      await updateOption('SMTPPort', inputs.SMTPPort);
    }
    if (originInputs['SMTPToken'] !== inputs.SMTPToken && inputs.SMTPToken !== '') {
      await updateOption('SMTPToken', inputs.SMTPToken);
    }
  };

  const submitEmailDomainWhitelist = async () => {
    await updateOption('EmailDomainWhitelist', inputs.EmailDomainWhitelist.join(','));
  };

  const submitWeChat = async () => {
    if (originInputs['WeChatServerAddress'] !== inputs.WeChatServerAddress) {
      await updateOption('WeChatServerAddress', removeTrailingSlash(inputs.WeChatServerAddress));
    }
    if (originInputs['WeChatAccountQRCodeImageURL'] !== inputs.WeChatAccountQRCodeImageURL) {
      await updateOption('WeChatAccountQRCodeImageURL', inputs.WeChatAccountQRCodeImageURL);
    }
    if (originInputs['WeChatServerToken'] !== inputs.WeChatServerToken && inputs.WeChatServerToken !== '') {
      await updateOption('WeChatServerToken', inputs.WeChatServerToken);
    }
  };

  const submitGitHubOAuth = async () => {
    if (originInputs['GitHubClientId'] !== inputs.GitHubClientId) {
      await updateOption('GitHubClientId', inputs.GitHubClientId);
    }
    if (originInputs['GitHubClientSecret'] !== inputs.GitHubClientSecret && inputs.GitHubClientSecret !== '') {
      await updateOption('GitHubClientSecret', inputs.GitHubClientSecret);
    }
  };

  const submitTurnstile = async () => {
    if (originInputs['TurnstileSiteKey'] !== inputs.TurnstileSiteKey) {
      await updateOption('TurnstileSiteKey', inputs.TurnstileSiteKey);
    }
    if (originInputs['TurnstileSecretKey'] !== inputs.TurnstileSecretKey && inputs.TurnstileSecretKey !== '') {
      await updateOption('TurnstileSecretKey', inputs.TurnstileSecretKey);
    }
  };

  const submitMessagePusher = async () => {
    if (originInputs['MessagePusherAddress'] !== inputs.MessagePusherAddress) {
      await updateOption('MessagePusherAddress', removeTrailingSlash(inputs.MessagePusherAddress));
    }
    if (originInputs['MessagePusherToken'] !== inputs.MessagePusherToken && inputs.MessagePusherToken !== '') {
      await updateOption('MessagePusherToken', inputs.MessagePusherToken);
    }
  };

  const submitLarkOAuth = async () => {
    if (originInputs['LarkClientId'] !== inputs.LarkClientId) {
      await updateOption('LarkClientId', inputs.LarkClientId);
    }
    if (originInputs['LarkClientSecret'] !== inputs.LarkClientSecret && inputs.LarkClientSecret !== '') {
      await updateOption('LarkClientSecret', inputs.LarkClientSecret);
    }
  };

  const submitOidc = async () => {
    if (inputs.OidcWellKnown !== '') {
      if (!inputs.OidcWellKnown.startsWith('http://') && !inputs.OidcWellKnown.startsWith('https://')) {
        showError('Well-Known URL 必须以 http:// 或 https:// 开头');
        return;
      }
      try {
        const res = await API.get(inputs.OidcWellKnown);
        inputs.OidcAuthorizationEndpoint = res.data['authorization_endpoint'];
        inputs.OidcTokenEndpoint = res.data['token_endpoint'];
        inputs.OidcUserinfoEndpoint = res.data['userinfo_endpoint'];
        showSuccess('获取 OIDC 配置成功！');
      } catch (err) {
        showError("获取 OIDC 配置失败，请检查网络状况和 Well-Known URL 是否正确");
      }
    }

    if (originInputs['OidcWellKnown'] !== inputs.OidcWellKnown) {
      await updateOption('OidcWellKnown', inputs.OidcWellKnown);
    }
    if (originInputs['OidcClientId'] !== inputs.OidcClientId) {
      await updateOption('OidcClientId', inputs.OidcClientId);
    }
    if (originInputs['OidcClientSecret'] !== inputs.OidcClientSecret && inputs.OidcClientSecret !== '') {
      await updateOption('OidcClientSecret', inputs.OidcClientSecret);
    }
    if (originInputs['OidcAuthorizationEndpoint'] !== inputs.OidcAuthorizationEndpoint) {
      await updateOption('OidcAuthorizationEndpoint', inputs.OidcAuthorizationEndpoint);
    }
    if (originInputs['OidcTokenEndpoint'] !== inputs.OidcTokenEndpoint) {
      await updateOption('OidcTokenEndpoint', inputs.OidcTokenEndpoint);
    }
    if (originInputs['OidcUserinfoEndpoint'] !== inputs.OidcUserinfoEndpoint) {
      await updateOption('OidcUserinfoEndpoint', inputs.OidcUserinfoEndpoint);
    }
  };

  return (
    <>
      <Stack spacing={2}>
        <SubCard title="一般設定">
          <Grid container spacing={{ xs: 3, sm: 2, md: 4 }}>
            <Grid xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="ServerAddress">サーバーアドレス</InputLabel>
                <OutlinedInput
                  id="ServerAddress"
                  name="ServerAddress"
                  value={inputs.ServerAddress || ''}
                  onChange={handleInputChange}
                  label="サーバーアドレス"
                  placeholder="例：：https://yourdomain.com"
                  disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <Button variant="contained" onClick={submitServerAddress}>
                サーバーアドレスを更新
              </Button>
            </Grid>
          </Grid>
        </SubCard>
        <SubCard title="ログイン/登録の設定">
          <Grid container spacing={{ xs: 3, sm: 2, md: 4 }}>
            <Grid xs={12} md={3}>
              <FormControlLabel
                label="パスワードによるログインを許可する"
                control={
                  <Checkbox checked={inputs.PasswordLoginEnabled === 'true'} onChange={handleInputChange} name="PasswordLoginEnabled" />
                }
              />
            </Grid>
            <Grid xs={12} md={3}>
              <FormControlLabel
                label="パスワードによる登録を許可する"
                control={
                  <Checkbox
                    checked={inputs.PasswordRegisterEnabled === 'true'}
                    onChange={handleInputChange}
                    name="PasswordRegisterEnabled"
                  />
                }
              />
            </Grid>
            <Grid xs={12} md={3}>
              <FormControlLabel
                label="パスワードで登録する場合はメール認証が必要です"
                control={
                  <Checkbox
                    checked={inputs.EmailVerificationEnabled === 'true'}
                    onChange={handleInputChange}
                    name="EmailVerificationEnabled"
                  />
                }
              />
            </Grid>
            <Grid xs={12} md={3}>
              <FormControlLabel
                label="GitHubアカウントによるログインと登録を許可する"
                control={<Checkbox checked={inputs.GitHubOAuthEnabled === 'true'} onChange={handleInputChange} name="GitHubOAuthEnabled" />}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <FormControlLabel
                label="允许通过 OIDC ログイン & 登録"
                control={<Checkbox checked={inputs.OidcEnabled === 'true'} onChange={handleInputChange} name="OidcEnabled" />}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <FormControlLabel
                label="WeChatによるログインと登録を許可する"
                control={<Checkbox checked={inputs.WeChatAuthEnabled === 'true'} onChange={handleInputChange} name="WeChatAuthEnabled" />}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <FormControlLabel
                label="新規ユーザーの登録を許可する（この項目が無効になっている場合、新規ユーザーはいかなる方法でも登録できません））"
                control={<Checkbox checked={inputs.RegisterEnabled === 'true'} onChange={handleInputChange} name="RegisterEnabled" />}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <FormControlLabel
                label="Turnstileユーザー検証を有効にする"
                control={
                  <Checkbox checked={inputs.TurnstileCheckEnabled === 'true'} onChange={handleInputChange} name="TurnstileCheckEnabled" />
                }
              />
            </Grid>
          </Grid>
        </SubCard>
        <SubCard title="配置邮箱域名白名单" subTitle="用以防止恶意ユーザー利用临时邮箱批量登録">
          <Grid container spacing={{ xs: 3, sm: 2, md: 4 }}>
            <Grid xs={12}>
              <FormControlLabel
                label="有効化邮箱域名白名单"
                control={
                  <Checkbox
                    checked={inputs.EmailDomainRestrictionEnabled === 'true'}
                    onChange={handleInputChange}
                    name="EmailDomainRestrictionEnabled"
                  />
                }
              />
            </Grid>
            <Grid xs={12}>
              <FormControl fullWidth>
                <Autocomplete
                  multiple
                  freeSolo
                  id="EmailDomainWhitelist"
                  options={EmailDomainWhitelist}
                  value={inputs.EmailDomainWhitelist}
                  onChange={(e, value) => {
                    const event = {
                      target: {
                        name: 'EmailDomainWhitelist',
                        value: value
                      }
                    };
                    handleInputChange(event);
                  }}
                  filterSelectedOptions
                  renderInput={(params) => <TextField {...params} name="EmailDomainWhitelist" label="允许的邮箱域名" />}
                  filterOptions={(options, params) => {
                    const filtered = filter(options, params);
                    const { inputValue } = params;
                    const isExisting = options.some((option) => inputValue === option);
                    if (inputValue !== '' && !isExisting) {
                      filtered.push(inputValue);
                    }
                    return filtered;
                  }}
                />
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <Button variant="contained" onClick={submitEmailDomainWhitelist}>
                保存邮箱域名白名单設定
              </Button>
            </Grid>
          </Grid>
        </SubCard>
        <SubCard title="SMTPの設定" subTitle="システムのメール送信をサポートするため">
          <Grid container spacing={{ xs: 3, sm: 2, md: 4 }}>
            <Grid xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="SMTPServer">SMTPサーバーアドレス</InputLabel>
                <OutlinedInput
                  id="SMTPServer"
                  name="SMTPServer"
                  value={inputs.SMTPServer || ''}
                  onChange={handleInputChange}
                  label="SMTPサーバーアドレス"
                  placeholder="例：smtp.qq.com"
                  disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="SMTPPort">SMTPポート</InputLabel>
                <OutlinedInput
                  id="SMTPPort"
                  name="SMTPPort"
                  value={inputs.SMTPPort || ''}
                  onChange={handleInputChange}
                  label="SMTPポート"
                  placeholder="デフォルト：587"
                  disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="SMTPAccount">SMTPアカウント</InputLabel>
                <OutlinedInput
                  id="SMTPAccount"
                  name="SMTPAccount"
                  value={inputs.SMTPAccount || ''}
                  onChange={handleInputChange}
                  label="SMTPアカウント"
                  placeholder="通常はメールアドレスです"
                  disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="SMTPFrom">SMTP 送信者メールアドレス</InputLabel>
                <OutlinedInput
                  id="SMTPFrom"
                  name="SMTPFrom"
                  value={inputs.SMTPFrom || ''}
                  onChange={handleInputChange}
                  label="SMTP 送信者メールアドレス"
                  placeholder="通常はメールアドレスと一致します"
                  disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="SMTPToken">SMTPアクセス認証情報</InputLabel>
                <OutlinedInput
                  id="SMTPToken"
                  name="SMTPToken"
                  value={inputs.SMTPToken || ''}
                  onChange={handleInputChange}
                  label="SMTPアクセス認証情報"
                  placeholder="機密情報はフロントエンドに送信されません"
                  disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <Button variant="contained" onClick={submitSMTP}>
                SMTP設定を保存
              </Button>
            </Grid>
          </Grid>
        </SubCard>
        <SubCard
          title="GitHub OAuthアプリの設定"
          subTitle={
            <span>
              {' '}
              GitHubによるログインと登録をサポートするため，
              <a href="https://github.com/settings/developers" target="_blank" rel="noopener noreferrer">
                ここをクリック
              </a>
              GitHub OAuthアプリを管理する
            </span>
          }
        >
          <Grid container spacing={{ xs: 3, sm: 2, md: 4 }}>
            <Grid xs={12}>
              <Alert severity="info" sx={{ wordWrap: 'break-word' }}>
                ホームページURLを入力 <b>{inputs.ServerAddress}</b>
                ，認証コールバックURLを入力 <b>{`${inputs.ServerAddress}/oauth/github`}</b>
              </Alert>
            </Grid>
            <Grid xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor="GitHubClientId">GitHub Client ID</InputLabel>
                <OutlinedInput
                  id="GitHubClientId"
                  name="GitHubClientId"
                  value={inputs.GitHubClientId || ''}
                  onChange={handleInputChange}
                  label="GitHub Client ID"
                  placeholder="登録済みのGitHub OAuthアプリのIDを入力してください"
                  disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor="GitHubClientSecret">GitHub Client Secret</InputLabel>
                <OutlinedInput
                  id="GitHubClientSecret"
                  name="GitHubClientSecret"
                  value={inputs.GitHubClientSecret || ''}
                  onChange={handleInputChange}
                  label="GitHub Client Secret"
                  placeholder="機密情報はフロントエンドに送信されません"
                  disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <Button variant="contained" onClick={submitGitHubOAuth}>
                GitHub OAuth設定を保存
              </Button>
            </Grid>
          </Grid>
        </SubCard>
        <SubCard
          title="配置飞书授权ログイン"
          subTitle={
            <span>
              {' '}
              用以支持通过飞书进行ログイン登録，
              <a href="https://open.feishu.cn/app" target="_blank" rel="noreferrer">
                ここをクリック
              </a>
              管理你的飞书应用
            </span>
          }
        >
          <Grid container spacing={{ xs: 3, sm: 2, md: 4 }}>
            <Grid xs={12}>
              <Alert severity="info" sx={{ wordWrap: 'break-word' }}>
                主页链接填 <code>{inputs.ServerAddress}</code>
                ，重定向 URL 填 <code>{`${inputs.ServerAddress}/oauth/lark`}</code>
              </Alert>
            </Grid>
            <Grid xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor="LarkClientId">App ID</InputLabel>
                <OutlinedInput
                  id="LarkClientId"
                  name="LarkClientId"
                  value={inputs.LarkClientId || ''}
                  onChange={handleInputChange}
                  label="App ID"
                  placeholder="入力 App ID"
                  disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor="LarkClientSecret">App Secret</InputLabel>
                <OutlinedInput
                  id="LarkClientSecret"
                  name="LarkClientSecret"
                  value={inputs.LarkClientSecret || ''}
                  onChange={handleInputChange}
                  label="App Secret"
                  placeholder="機密情報はフロントエンドに送信されません"
                  disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <Button variant="contained" onClick={submitLarkOAuth}>
                保存飞书 OAuth 設定
              </Button>
            </Grid>
          </Grid>
        </SubCard>
        <SubCard
          title="WeChatサーバーの設定"
          subTitle={
            <span>
              WeChatによるログインと登録をサポートするため，
              <a href="https://github.com/songquanpeng/wechat-server" target="_blank" rel="noopener noreferrer">
                ここをクリック
              </a>
              WeChatサーバーについて
            </span>
          }
        >
          <Grid container spacing={{ xs: 3, sm: 2, md: 4 }}>
            <Grid xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="WeChatServerAddress">WeChat Server サーバーアドレス</InputLabel>
                <OutlinedInput
                  id="WeChatServerAddress"
                  name="WeChatServerAddress"
                  value={inputs.WeChatServerAddress || ''}
                  onChange={handleInputChange}
                  label="WeChat Server サーバーアドレス"
                  placeholder="例：：https://yourdomain.com"
                  disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="WeChatServerToken">WeChatサーバーアクセス認証情報</InputLabel>
                <OutlinedInput
                  id="WeChatServerToken"
                  name="WeChatServerToken"
                  value={inputs.WeChatServerToken || ''}
                  onChange={handleInputChange}
                  label="WeChatサーバーアクセス認証情報"
                  placeholder="機密情報はフロントエンドに送信されません"
                  disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="WeChatAccountQRCodeImageURL">WeChat公式アカウントQRコード画像リンク</InputLabel>
                <OutlinedInput
                  id="WeChatAccountQRCodeImageURL"
                  name="WeChatAccountQRCodeImageURL"
                  value={inputs.WeChatAccountQRCodeImageURL || ''}
                  onChange={handleInputChange}
                  label="WeChat公式アカウントQRコード画像リンク"
                  placeholder="画像リンクを入力"
                  disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <Button variant="contained" onClick={submitWeChat}>
                WeChatサーバー設定を保存
              </Button>
            </Grid>
          </Grid>
        </SubCard>

        <SubCard
          title="配置 OIDC"
          subTitle={
            <span>
              用以支持通过 OIDC ログイン，例： Okta、Auth0 等兼容 OIDC 协议的 IdP
            </span>
          }
        >
          <Grid container spacing={ { xs: 3, sm: 2, md: 4 } }>
            <Grid xs={ 12 } md={ 12 }>
              <Alert severity="info" sx={ { wordWrap: 'break-word' } }>
                主页链接填 <code>{ inputs.ServerAddress }</code>
                ，重定向 URL 填 <code>{ `${ inputs.ServerAddress }/oauth/oidc` }</code>
              </Alert> <br />
              <Alert severity="info" sx={ { wordWrap: 'break-word' } }>
                若你的 OIDC Provider 支持 Discovery Endpoint，你可以仅填写 OIDC Well-Known URL，系统会自动获取 OIDC 配置
              </Alert>
            </Grid>
            <Grid xs={ 12 } md={ 6 }>
              <FormControl fullWidth>
                <InputLabel htmlFor="OidcClientId">Client ID</InputLabel>
                <OutlinedInput
                  id="OidcClientId"
                  name="OidcClientId"
                  value={ inputs.OidcClientId || '' }
                  onChange={ handleInputChange }
                  label="Client ID"
                  placeholder="入力 OIDC 的 Client ID"
                  disabled={ loading }
                />
              </FormControl>
            </Grid>
            <Grid xs={ 12 } md={ 6 }>
              <FormControl fullWidth>
                <InputLabel htmlFor="OidcClientSecret">Client Secret</InputLabel>
                <OutlinedInput
                  id="OidcClientSecret"
                  name="OidcClientSecret"
                  value={ inputs.OidcClientSecret || '' }
                  onChange={ handleInputChange }
                  label="Client Secret"
                  placeholder="機密情報はフロントエンドに送信されません"
                  disabled={ loading }
                />
              </FormControl>
            </Grid>
            <Grid xs={ 12 } md={ 6 }>
              <FormControl fullWidth>
                <InputLabel htmlFor="OidcWellKnown">Well-Known URL</InputLabel>
                <OutlinedInput
                  id="OidcWellKnown"
                  name="OidcWellKnown"
                  value={ inputs.OidcWellKnown || '' }
                  onChange={ handleInputChange }
                  label="Well-Known URL"
                  placeholder="请入力 OIDC 的 Well-Known URL"
                  disabled={ loading }
                />
              </FormControl>
            </Grid>
            <Grid xs={ 12 } md={ 6 }>
              <FormControl fullWidth>
                <InputLabel htmlFor="OidcAuthorizationEndpoint">Authorization Endpoint</InputLabel>
                <OutlinedInput
                  id="OidcAuthorizationEndpoint"
                  name="OidcAuthorizationEndpoint"
                  value={ inputs.OidcAuthorizationEndpoint || '' }
                  onChange={ handleInputChange }
                  label="Authorization Endpoint"
                  placeholder="入力 OIDC 的 Authorization Endpoint"
                  disabled={ loading }
                />
              </FormControl>
            </Grid>
            <Grid xs={ 12 } md={ 6 }>
              <FormControl fullWidth>
                <InputLabel htmlFor="OidcTokenEndpoint">Token Endpoint</InputLabel>
                <OutlinedInput
                  id="OidcTokenEndpoint"
                  name="OidcTokenEndpoint"
                  value={ inputs.OidcTokenEndpoint || '' }
                  onChange={ handleInputChange }
                  label="Token Endpoint"
                  placeholder="入力 OIDC 的 Token Endpoint"
                  disabled={ loading }
                />
              </FormControl>
            </Grid>
            <Grid xs={ 12 } md={ 6 }>
              <FormControl fullWidth>
                <InputLabel htmlFor="OidcUserinfoEndpoint">Userinfo Endpoint</InputLabel>
                <OutlinedInput
                  id="OidcUserinfoEndpoint"
                  name="OidcUserinfoEndpoint"
                  value={ inputs.OidcUserinfoEndpoint || '' }
                  onChange={ handleInputChange }
                  label="Userinfo Endpoint"
                  placeholder="入力 OIDC 的 Userinfo Endpoint"
                  disabled={ loading }
                />
              </FormControl>
            </Grid>
            <Grid xs={ 12 }>
              <Button variant="contained" onClick={ submitOidc }>
                保存 OIDC 設定
              </Button>
            </Grid>
          </Grid>
        </SubCard>

        <SubCard
          title="配置 Message Pusher"
          subTitle={
            <span>
              用以推送报警信息，
              <a href="https://github.com/songquanpeng/message-pusher" target="_blank" rel="noreferrer">
                ここをクリック
              </a>
              了解 Message Pusher
            </span>
          }
        >
          <Grid container spacing={{ xs: 3, sm: 2, md: 4 }}>
            <Grid xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor="MessagePusherAddress">Message Pusher 推送地址</InputLabel>
                <OutlinedInput
                  id="MessagePusherAddress"
                  name="MessagePusherAddress"
                  value={inputs.MessagePusherAddress || ''}
                  onChange={handleInputChange}
                  label="Message Pusher 推送地址"
                  placeholder="例：：https://msgpusher.com/push/your_username"
                  disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor="MessagePusherToken">Message Pusher 访问凭证</InputLabel>
                <OutlinedInput
                  id="MessagePusherToken"
                  name="MessagePusherToken"
                  type="password"
                  value={inputs.MessagePusherToken || ''}
                  onChange={handleInputChange}
                  label="Message Pusher 访问凭证"
                  placeholder="機密情報はフロントエンドに送信されません"
                  disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <Button variant="contained" onClick={submitMessagePusher}>
                保存 Message Pusher 設定
              </Button>
            </Grid>
          </Grid>
        </SubCard>
        <SubCard
          title="Turnstileの設定"
          subTitle={
            <span>
              ユーザー検証をサポートするため，
              <a href="https://dash.cloudflare.com/" target="_blank" rel="noopener noreferrer">
                ここをクリック
              </a>
              Turnstileサイトを管理します。Invisible Widget Typeを選択することをお勧めします
            </span>
          }
        >
          <Grid container spacing={{ xs: 3, sm: 2, md: 4 }}>
            <Grid xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor="TurnstileSiteKey">Turnstile Site Key</InputLabel>
                <OutlinedInput
                  id="TurnstileSiteKey"
                  name="TurnstileSiteKey"
                  value={inputs.TurnstileSiteKey || ''}
                  onChange={handleInputChange}
                  label="Turnstile Site Key"
                  placeholder="登録済みのTurnstileサイトキーを入力してください"
                  disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor="TurnstileSecretKey">Turnstile Secret Key</InputLabel>
                <OutlinedInput
                  id="TurnstileSecretKey"
                  name="TurnstileSecretKey"
                  type="password"
                  value={inputs.TurnstileSecretKey || ''}
                  onChange={handleInputChange}
                  label="Turnstile Secret Key"
                  placeholder="機密情報はフロントエンドに送信されません"
                  disabled={loading}
                />
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <Button variant="contained" onClick={submitTurnstile}>
                Turnstile設定を保存
              </Button>
            </Grid>
          </Grid>
        </SubCard>
      </Stack>
      <Dialog open={showPasswordWarningModal} onClose={() => setShowPasswordWarningModal(false)} maxWidth={'md'}>
        <DialogTitle sx={{ margin: '0px', fontWeight: 700, lineHeight: '1.55556', padding: '24px', fontSize: '1.125rem' }}>
          警告
        </DialogTitle>
        <Divider />
        <DialogContent>パスワードログインをキャンセルすると、他のログイン方法を紐付けていないすべてのユーザー（管理者を含む）がパスワードでログインできなくなります。キャンセルしますか？</DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordWarningModal(false)}>キャンセル</Button>
          <Button
            sx={{ color: 'error.main' }}
            onClick={async () => {
              setShowPasswordWarningModal(false);
              await updateOption('PasswordLoginEnabled', 'false');
            }}
          >
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SystemSetting;
