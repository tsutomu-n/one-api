import React, { useState } from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import { API, showError, showSuccess } from '../../helpers';

const AddUser = () => {
  const originInputs = {
    username: '',
    display_name: '',
    password: '',
  };
  const [inputs, setInputs] = useState(originInputs);
  const { username, display_name, password } = inputs;

  const handleInputChange = (e, { name, value }) => {
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  const submit = async () => {
    if (inputs.username === '' || inputs.password === '') return;
    const res = await API.post(`/api/user/`, inputs);
    const { success, message } = res.data;
    if (success) {
      showSuccess('ユーザーアカウントの作成に成功しました！');
      setInputs(originInputs);
    } else {
      showError(message);
    }
  };

  return (
    <>
      <Segment>
        <Header as="h3">新しいユーザーアカウントを作成</Header>
        <Form autoComplete="off">
          <Form.Field>
            <Form.Input
              label="ユーザー名"
              name="username"
              placeholder={'ユーザー名を入力してください'}
              onChange={handleInputChange}
              value={username}
              autoComplete="off"
              required
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              label="表示名"
              name="display_name"
              placeholder={'表示名を入力してください'}
              onChange={handleInputChange}
              value={display_name}
              autoComplete="off"
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              label="パスワード"
              name="password"
              type={'password'}
              placeholder={'パスワードを入力してください'}
              onChange={handleInputChange}
              value={password}
              autoComplete="off"
              required
            />
          </Form.Field>
          <Button positive type={'submit'} onClick={submit}>
            送信
          </Button>
        </Form>
      </Segment>
    </>
  );
};

export default AddUser;
