import React, { useEffect, useState } from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import { useParams, useNavigate } from 'react-router-dom';
import { API, showError, showSuccess } from '../../helpers';
import { renderQuota, renderQuotaWithPrompt } from '../../helpers/render';

const EditUser = () => {
  const params = useParams();
  const userId = params.id;
  const [loading, setLoading] = useState(true);
  const [inputs, setInputs] = useState({
    username: '',
    display_name: '',
    password: '',
    github_id: '',
    wechat_id: '',
    email: '',
    quota: 0,
    group: 'default'
  });
  const [groupOptions, setGroupOptions] = useState([]);
  const { username, display_name, password, github_id, wechat_id, email, quota, group } =
    inputs;
  const handleInputChange = (e, { name, value }) => {
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };
  const fetchGroups = async () => {
    try {
      let res = await API.get(`/api/group/`);
      setGroupOptions(res.data.data.map((group) => ({
        key: group,
        text: group,
        value: group,
      })));
    } catch (error) {
      showError(error.message);
    }
  };
  const navigate = useNavigate();
  const handleCancel = () => {
    navigate("/setting");
  }
  const loadUser = async () => {
    let res = undefined;
    if (userId) {
      res = await API.get(`/api/user/${userId}`);
    } else {
      res = await API.get(`/api/user/self`);
    }
    const { success, message, data } = res.data;
    if (success) {
      data.password = '';
      setInputs(data);
    } else {
      showError(message);
    }
    setLoading(false);
  };
  useEffect(() => {
    loadUser().then();
    if (userId) {
      fetchGroups().then();
    }
  }, []);

  const submit = async () => {
    let res = undefined;
    if (userId) {
      let data = { ...inputs, id: parseInt(userId) };
      if (typeof data.quota === 'string') {
        data.quota = parseInt(data.quota);
      }
      res = await API.put(`/api/user/`, data);
    } else {
      res = await API.put(`/api/user/self`, inputs);
    }
    const { success, message } = res.data;
    if (success) {
      showSuccess('ユーザー情報の更新に成功しました！');
    } else {
      showError(message);
    }
  };

  return (
    <>
      <Segment loading={loading}>
        <Header as='h3'>ユーザー情報を更新</Header>
        <Form autoComplete='new-password'>
          <Form.Field>
            <Form.Input
              label='ユーザー名'
              name='username'
              placeholder={'新しいユーザー名を入力してください'}
              onChange={handleInputChange}
              value={username}
              autoComplete='new-password'
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              label='パスワード'
              name='password'
              type={'password'}
              placeholder={'新しいパスワードを入力してください，最短 8 位'}
              onChange={handleInputChange}
              value={password}
              autoComplete='new-password'
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              label='表示名'
              name='display_name'
              placeholder={'新しい表示名を入力してください'}
              onChange={handleInputChange}
              value={display_name}
              autoComplete='new-password'
            />
          </Form.Field>
          {
            userId && <>
              <Form.Field>
                <Form.Dropdown
                  label='グループ'
                  placeholder={'グループを選択してください'}
                  name='group'
                  fluid
                  search
                  selection
                  allowAdditions
                  additionLabel={'システム設定ページでグループレートを編集して、新しいグループを追加してください：'}
                  onChange={handleInputChange}
                  value={inputs.group}
                  autoComplete='new-password'
                  options={groupOptions}
                />
              </Form.Field>
              <Form.Field>
                <Form.Input
                  label={`残り割り当て${renderQuotaWithPrompt(quota)}`}
                  name='quota'
                  placeholder={'新しい残り割り当てを入力してください'}
                  onChange={handleInputChange}
                  value={quota}
                  type={'number'}
                  autoComplete='new-password'
                />
              </Form.Field>
            </>
          }
          <Form.Field>
            <Form.Input
              label='紐付け済みのGitHubアカウント'
              name='github_id'
              value={github_id}
              autoComplete='new-password'
              placeholder='この項目は読み取り専用です。ユーザーは個人設定ページの関連する紐付けボタンを使用して紐付ける必要があります。直接変更することはできません'
              readOnly
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              label='紐付け済みのWeChatアカウント'
              name='wechat_id'
              value={wechat_id}
              autoComplete='new-password'
              placeholder='この項目は読み取り専用です。ユーザーは個人設定ページの関連する紐付けボタンを使用して紐付ける必要があります。直接変更することはできません'
              readOnly
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              label='紐付け済みのメールアカウント'
              name='email'
              value={email}
              autoComplete='new-password'
              placeholder='この項目は読み取り専用です。ユーザーは個人設定ページの関連する紐付けボタンを使用して紐付ける必要があります。直接変更することはできません'
              readOnly
            />
          </Form.Field>
          <Button onClick={handleCancel}>キャンセル</Button>
          <Button positive onClick={submit}>送信</Button>
        </Form>
      </Segment>
    </>
  );
};

export default EditUser;
