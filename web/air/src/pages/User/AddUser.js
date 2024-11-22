import React, { useState } from 'react';
import { API, isMobile, showError, showSuccess } from '../../helpers';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import { Button, Input, SideSheet, Space, Spin } from '@douyinfe/semi-ui';

const AddUser = (props) => {
  const originInputs = {
    username: '',
    display_name: '',
    password: ''
  };
  const [inputs, setInputs] = useState(originInputs);
  const [loading, setLoading] = useState(false);
  const { username, display_name, password } = inputs;

  const handleInputChange = (name, value) => {
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  const submit = async () => {
    setLoading(true);
    if (inputs.username === '' || inputs.password === '') return;
    const res = await API.post(`/api/user/`, inputs);
    const { success, message } = res.data;
    if (success) {
      showSuccess('ユーザーアカウントの作成に成功しました！');
      setInputs(originInputs);
      props.refresh();
      props.handleClose();
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const handleCancel = () => {
    props.handleClose();
  };

  return (
    <>
      <SideSheet
        placement={'left'}
        title={<Title level={3}>{'添加ユーザー'}</Title>}
        headerStyle={{ borderBottom: '1px solid var(--semi-color-border)' }}
        bodyStyle={{ borderBottom: '1px solid var(--semi-color-border)' }}
        visible={props.visible}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Space>
              <Button theme="solid" size={'large'} onClick={submit}>送信</Button>
              <Button theme="solid" size={'large'} type={'tertiary'} onClick={handleCancel}>キャンセル</Button>
            </Space>
          </div>
        }
        closeIcon={null}
        onCancel={() => handleCancel()}
        width={isMobile() ? '100%' : 600}
      >
        <Spin spinning={loading}>
          <Input
            style={{ marginTop: 20 }}
            label="ユーザー名"
            name="username"
            addonBefore={'ユーザー名'}
            placeholder={'ユーザー名を入力してください'}
            onChange={value => handleInputChange('username', value)}
            value={username}
            autoComplete="off"
          />
          <Input
            style={{ marginTop: 20 }}
            addonBefore={'显示名'}
            label="表示名"
            name="display_name"
            autoComplete="off"
            placeholder={'表示名を入力してください'}
            onChange={value => handleInputChange('display_name', value)}
            value={display_name}
          />
          <Input
            style={{ marginTop: 20 }}
            label="密 码"
            name="password"
            type={'password'}
            addonBefore={'パスワード'}
            placeholder={'パスワードを入力してください'}
            onChange={value => handleInputChange('password', value)}
            value={password}
            autoComplete="off"
          />
        </Spin>
      </SideSheet>
    </>
  );
};

export default AddUser;
