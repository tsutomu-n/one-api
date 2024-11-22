import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API, isMobile, showError, showSuccess, timestamp2string } from '../../helpers';
import { renderQuotaWithPrompt } from '../../helpers/render';
import {
    AutoComplete,
    Banner,
    Button,
    Checkbox,
    DatePicker,
    Input,
    Select,
    SideSheet,
    Space,
    Spin,
    Typography
} from '@douyinfe/semi-ui';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import { Divider } from 'semantic-ui-react';

const EditToken = (props) => {
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const originInputs = {
    name: '',
    remain_quota: isEdit ? 0 : 500000,
    expired_time: -1,
    unlimited_quota: false,
    model_limits_enabled: false,
    model_limits: []
  };
  const [inputs, setInputs] = useState(originInputs);
  const { name, remain_quota, expired_time, unlimited_quota, model_limits_enabled, model_limits } = inputs;
  // const [visible, setVisible] = useState(false);
  const [models, setModels] = useState({});
  const navigate = useNavigate();
  const handleInputChange = (name, value) => {
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };
  const handleCancel = () => {
    props.handleClose();
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

  // const loadModels = async () => {
  //   let res = await API.get(`/api/user/models`);
  //   const { success, message, data } = res.data;
  //   if (success) {
  //     let localModelOptions = data.map((model) => ({
  //       label: model,
  //       value: model
  //     }));
  //     setModels(localModelOptions);
  //   } else {
  //     showError(message);
  //   }
  // };

  const loadToken = async () => {
    setLoading(true);
    let res = await API.get(`/api/token/${props.editingToken.id}`);
    const { success, message, data } = res.data;
    if (success) {
      if (data.expired_time !== -1) {
        data.expired_time = timestamp2string(data.expired_time);
      }
      // if (data.model_limits !== '') {
      //   data.model_limits = data.model_limits.split(',');
      // } else {
      //   data.model_limits = [];
      // }
      setInputs(data);
    } else {
      showError(message);
    }
    setLoading(false);
  };
  useEffect(() => {
    setIsEdit(props.editingToken.id !== undefined);
  }, [props.editingToken.id]);

  useEffect(() => {
    if (!isEdit) {
      setInputs(originInputs);
    } else {
      loadToken().then(
        () => {
          // console.log(inputs);
        }
      );
    }
    // loadModels();
  }, [isEdit]);

  // 新增 state 变量 tokenCount 来记录ユーザー想要创建的APIキー数量，デフォルト为 1
  const [tokenCount, setTokenCount] = useState(1);

  // 新增处理 tokenCount 变化的函数
  const handleTokenCountChange = (value) => {
    // 确保ユーザー入力的是正整数
    const count = parseInt(value, 10);
    if (!isNaN(count) && count > 0) {
      setTokenCount(count);
    }
  };

  // 生成一个随机的四位字母数字字符串
  const generateRandomSuffix = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const submit = async () => {
    setLoading(true);
    if (isEdit) {
      // 編集APIキー的逻辑保持不变
      let localInputs = { ...inputs };
      localInputs.remain_quota = parseInt(localInputs.remain_quota);
      if (localInputs.expired_time !== -1) {
        let time = Date.parse(localInputs.expired_time);
        if (isNaN(time)) {
          showError('有効期限の形式が正しくありません！');
          setLoading(false);
          return;
        }
        localInputs.expired_time = Math.ceil(time / 1000);
      }
      // localInputs.model_limits = localInputs.model_limits.join(',');
      let res = await API.put(`/api/token/`, { ...localInputs, id: parseInt(props.editingToken.id) });
      const { success, message } = res.data;
      if (success) {
        showSuccess('APIキーの更新に成功しました！');
        props.refresh();
        props.handleClose();
      } else {
        showError(message);
      }
    } else {
      // 处理新增多个APIキー的情况
      let successCount = 0; // 记录成功创建的APIキー数量
      for (let i = 0; i < tokenCount; i++) {
        let localInputs = { ...inputs };
        if (i !== 0) {
          // 如果ユーザー想要创建多个APIキー，则给每个APIキー一个序号后缀
          localInputs.name = `${inputs.name}-${generateRandomSuffix()}`;
        }
        localInputs.remain_quota = parseInt(localInputs.remain_quota);

        if (localInputs.expired_time !== -1) {
          let time = Date.parse(localInputs.expired_time);
          if (isNaN(time)) {
            showError('有効期限の形式が正しくありません！');
            setLoading(false);
            break;
          }
          localInputs.expired_time = Math.ceil(time / 1000);
        }
        // localInputs.model_limits = localInputs.model_limits.join(',');
        let res = await API.post(`/api/token/`, localInputs);
        const { success, message } = res.data;

        if (success) {
          successCount++;
        } else {
          showError(message);
          break; // 如果创建失败，终止循环
        }
      }

      if (successCount > 0) {
        showSuccess(`${successCount}个APIキーの作成に成功しました。リストページでコピーをクリックしてAPIキーを取得してください！`);
        props.refresh();
        props.handleClose();
      }
    }
    setLoading(false);
    setInputs(originInputs); // 重置表单
    setTokenCount(1); // 重置数量为デフォルト值
  };


  return (
    <>
      <SideSheet
        placement={isEdit ? 'right' : 'left'}
        title={<Title level={3}>{isEdit ? 'APIキー情報を更新' : '新しいAPIキーを作成'}</Title>}
        headerStyle={{ borderBottom: '1px solid var(--semi-color-border)' }}
        bodyStyle={{ borderBottom: '1px solid var(--semi-color-border)' }}
        visible={props.visiable}
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
            label="名前"
            name="name"
            placeholder={'名前を入力してください'}
            onChange={(value) => handleInputChange('name', value)}
            value={name}
            autoComplete="new-password"
            required={!isEdit}
          />
          <Divider />
          <DatePicker
            label="有効期限"
            name="expired_time"
            placeholder={'请选择有効期限'}
            onChange={(value) => handleInputChange('expired_time', value)}
            value={expired_time}
            autoComplete="new-password"
            type="dateTime"
          />
          <div style={{ marginTop: 20 }}>
            <Space>
              <Button type={'tertiary'} onClick={() => {
                setExpiredTime(0, 0, 0, 0);
              }}>無期限</Button>
              <Button type={'tertiary'} onClick={() => {
                setExpiredTime(0, 0, 1, 0);
              }}>一小时</Button>
              <Button type={'tertiary'} onClick={() => {
                setExpiredTime(1, 0, 0, 0);
              }}>一个月</Button>
              <Button type={'tertiary'} onClick={() => {
                setExpiredTime(0, 1, 0, 0);
              }}>一天</Button>
            </Space>
          </div>

          <Divider />
          <Banner type={'warning'}
                  description={'トークンの割り当ては、トークン自体の最大割り当て使用量を制限するためにのみ使用されます。実際の使用量は、アカウントの残りの割り当てによって制限されます。'}></Banner>
          <div style={{ marginTop: 20 }}>
            <Typography.Text>{`割り当て${renderQuotaWithPrompt(remain_quota)}`}</Typography.Text>
          </div>
          <AutoComplete
            style={{ marginTop: 8 }}
            name="remain_quota"
            placeholder={'割り当てを入力してください'}
            onChange={(value) => handleInputChange('remain_quota', value)}
            value={remain_quota}
            autoComplete="new-password"
            type="number"
            // position={'top'}
            data={[
              { value: 500000, label: '1$' },
              { value: 5000000, label: '10$' },
              { value: 25000000, label: '50$' },
              { value: 50000000, label: '100$' },
              { value: 250000000, label: '500$' },
              { value: 500000000, label: '1000$' }
            ]}
            disabled={unlimited_quota}
          />

          {!isEdit && (
            <>
              <div style={{ marginTop: 20 }}>
                <Typography.Text>新建数量</Typography.Text>
              </div>
              <AutoComplete
                style={{ marginTop: 8 }}
                label="数量"
                placeholder={'请选择或入力创建APIキー的数量'}
                onChange={(value) => handleTokenCountChange(value)}
                onSelect={(value) => handleTokenCountChange(value)}
                value={tokenCount.toString()}
                autoComplete="off"
                type="number"
                data={[
                  { value: 10, label: '10个' },
                  { value: 20, label: '20个' },
                  { value: 30, label: '30个' },
                  { value: 100, label: '100个' }
                ]}
                disabled={unlimited_quota}
              />
            </>
          )}

          <div>
            <Button style={{ marginTop: 8 }} type={'warning'} onClick={() => {
              setUnlimitedQuota();
            }}>{unlimited_quota ? '無制限割り当てをキャンセル' : '無制限割り当てに設定'}</Button>
          </div>
          {/* <Divider />
          <div style={{ marginTop: 10, display: 'flex' }}>
            <Space>
              <Checkbox
                name="model_limits_enabled"
                checked={model_limits_enabled}
                onChange={(e) => handleInputChange('model_limits_enabled', e.target.checked)}
              >
              </Checkbox>
              <Typography.Text>有効化モデル限制（非必要，不建议有効化）</Typography.Text>
            </Space>
          </div>

          <Select
            style={{ marginTop: 8 }}
            placeholder={'このチャネルでサポートされているモデルを選択してください'}
            name="models"
            required
            multiple
            selection
            onChange={value => {
              handleInputChange('model_limits', value);
            }}
            value={inputs.model_limits}
            autoComplete="new-password"
            optionList={models}
            disabled={!model_limits_enabled}
          /> */}
        </Spin>
      </SideSheet>
    </>
  );
};

export default EditToken;
