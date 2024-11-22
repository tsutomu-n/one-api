import React, { useEffect, useState } from 'react';
import { Button, Form, Header, Message, Segment } from 'semantic-ui-react';
import { useNavigate, useParams } from 'react-router-dom';
import { API, copy, showError, showSuccess, timestamp2string } from '../../helpers';
import { renderQuotaWithPrompt } from '../../helpers/render';

const EditToken = () => {
  const params = useParams();
  const tokenId = params.id;
  const isEdit = tokenId !== undefined;
  const [loading, setLoading] = useState(isEdit);
  const [modelOptions, setModelOptions] = useState([]);
  const originInputs = {
    name: '',
    remain_quota: isEdit ? 0 : 500000,
    expired_time: -1,
    unlimited_quota: false,
    models: [],
    subnet: "",
  };
  const [inputs, setInputs] = useState(originInputs);
  const { name, remain_quota, expired_time, unlimited_quota } = inputs;
  const navigate = useNavigate();
  const handleInputChange = (e, { name, value }) => {
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };
  const handleCancel = () => {
    navigate('/token');
  };
  const setExpiredTime = (month, day, hour, minute) => {
    let now = new Date();
    let timestamp = now.getTime() / 1000;
    let seconds = month * 30 * 24 * 60 * 60;
    seconds += day * 24 * 60 * 60;
    seconds += hour * 60 * 60;
    seconds += minute * 60;
    if (seconds !== 0) {
      timestamp += seconds;
      setInputs({ ...inputs, expired_time: timestamp2string(timestamp) });
    } else {
      setInputs({ ...inputs, expired_time: -1 });
    }
  };

  const setUnlimitedQuota = () => {
    setInputs({ ...inputs, unlimited_quota: !unlimited_quota });
  };

  const loadToken = async () => {
    let res = await API.get(`/api/token/${tokenId}`);
    const { success, message, data } = res.data;
    if (success) {
      if (data.expired_time !== -1) {
        data.expired_time = timestamp2string(data.expired_time);
      }
      if (data.models === '') {
        data.models = [];
      } else {
        data.models = data.models.split(',');
      }
      setInputs(data);
    } else {
      showError(message);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (isEdit) {
      loadToken().then();
    }
    loadAvailableModels().then();
  }, []);

  const loadAvailableModels = async () => {
    let res = await API.get(`/api/user/available_models`);
    const { success, message, data } = res.data;
    if (success) {
      let options = data.map((model) => {
        return {
          key: model,
          text: model,
          value: model
        };
      });
      setModelOptions(options);
    } else {
      showError(message);
    }
  };

  const submit = async () => {
    if (!isEdit && inputs.name === '') return;
    let localInputs = inputs;
    localInputs.remain_quota = parseInt(localInputs.remain_quota);
    if (localInputs.expired_time !== -1) {
      let time = Date.parse(localInputs.expired_time);
      if (isNaN(time)) {
        showError('有効期限の形式が正しくありません！');
        return;
      }
      localInputs.expired_time = Math.ceil(time / 1000);
    }
    localInputs.models = localInputs.models.join(',');
    let res;
    if (isEdit) {
      res = await API.put(`/api/token/`, { ...localInputs, id: parseInt(tokenId) });
    } else {
      res = await API.post(`/api/token/`, localInputs);
    }
    const { success, message } = res.data;
    if (success) {
      if (isEdit) {
        showSuccess('APIキーの更新に成功しました！');
      } else {
        showSuccess('APIキーの作成に成功しました。リストページでコピーをクリックしてAPIキーを取得してください！');
        setInputs(originInputs);
      }
    } else {
      showError(message);
    }
  };

  return (
    <>
      <Segment loading={loading}>
        <Header as='h3'>{isEdit ? 'APIキー情報を更新' : '新しいAPIキーを作成'}</Header>
        <Form autoComplete='new-password'>
          <Form.Field>
            <Form.Input
              label='名前'
              name='name'
              placeholder={'名前を入力してください'}
              onChange={handleInputChange}
              value={name}
              autoComplete='new-password'
              required={!isEdit}
            />
          </Form.Field>
          <Form.Field>
            <Form.Dropdown
              label='モデル范围'
              placeholder={'请选择允许使用的モデル，留空则不进行限制'}
              name='models'
              fluid
              multiple
              search
              onLabelClick={(e, { value }) => {
                copy(value).then();
              }}
              selection
              onChange={handleInputChange}
              value={inputs.models}
              autoComplete='new-password'
              options={modelOptions}
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              label='IP 限制'
              name='subnet'
              placeholder={'请入力允许访问的网段，例：：192.168.0.0/24，请使用英文逗号分隔多个网段'}
              onChange={handleInputChange}
              value={inputs.subnet}
              autoComplete='new-password'
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              label='有効期限'
              name='expired_time'
              placeholder={'有効期限を入力してください。形式はyyyy-MM-dd HH:mm:ssです。-1は無制限を意味します'}
              onChange={handleInputChange}
              value={expired_time}
              autoComplete='new-password'
              type='datetime-local'
            />
          </Form.Field>
          <div style={{ lineHeight: '40px' }}>
            <Button type={'button'} onClick={() => {
              setExpiredTime(0, 0, 0, 0);
            }}>無期限</Button>
            <Button type={'button'} onClick={() => {
              setExpiredTime(1, 0, 0, 0);
            }}>1か月後に期限切れ</Button>
            <Button type={'button'} onClick={() => {
              setExpiredTime(0, 1, 0, 0);
            }}>1日後に期限切れ</Button>
            <Button type={'button'} onClick={() => {
              setExpiredTime(0, 0, 1, 0);
            }}>1時間後に期限切れ</Button>
            <Button type={'button'} onClick={() => {
              setExpiredTime(0, 0, 0, 1);
            }}>1分後に期限切れ</Button>
          </div>
          <Message>トークンの割り当ては、トークン自体の最大割り当て使用量を制限するためにのみ使用されます。実際の使用量は、アカウントの残りの割り当てによって制限されます。</Message>
          <Form.Field>
            <Form.Input
              label={`割り当て${renderQuotaWithPrompt(remain_quota)}`}
              name='remain_quota'
              placeholder={'割り当てを入力してください'}
              onChange={handleInputChange}
              value={remain_quota}
              autoComplete='new-password'
              type='number'
              disabled={unlimited_quota}
            />
          </Form.Field>
          <Button type={'button'} onClick={() => {
            setUnlimitedQuota();
          }}>{unlimited_quota ? '無制限割り当てをキャンセル' : '無制限割り当てに設定'}</Button>
          <Button floated='right' positive onClick={submit}>送信</Button>
          <Button floated='right' onClick={handleCancel}>キャンセル</Button>
        </Form>
      </Segment>
    </>
  );
};

export default EditToken;
