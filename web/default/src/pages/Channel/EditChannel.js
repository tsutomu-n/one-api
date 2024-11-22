import React, { useEffect, useState } from 'react';
import { Button, Form, Header, Input, Message, Segment } from 'semantic-ui-react';
import { useNavigate, useParams } from 'react-router-dom';
import { API, copy, getChannelModels, showError, showInfo, showSuccess, verifyJSON } from '../../helpers';
import { CHANNEL_OPTIONS } from '../../constants';

const MODEL_MAPPING_EXAMPLE = {
  'gpt-3.5-turbo-0301': 'gpt-3.5-turbo',
  'gpt-4-0314': 'gpt-4',
  'gpt-4-32k-0314': 'gpt-4-32k'
};

function type2secretPrompt(type) {
  // inputs.type === 15 ? '次の形式で入力してください：APIKey|SecretKey' : (inputs.type === 18 ? '次の形式で入力してください：APPID|APISecret|APIKey' : 'チャネルに対応する認証キーを入力してください')
  switch (type) {
    case 15:
      return '次の形式で入力してください：APIKey|SecretKey';
    case 18:
      return '次の形式で入力してください：APPID|APISecret|APIKey';
    case 22:
      return '次の形式で入力してください：APIKey-AppId，例：：fastgpt-0sp2gtvfdgyi4k30jwlgwf1i-64f335d84283f05518e9e041';
    case 23:
      return '次の形式で入力してください：AppId|SecretId|SecretKey';
    default:
      return 'チャネルに対応する認証キーを入力してください';
  }
}

const EditChannel = () => {
  const params = useParams();
  const navigate = useNavigate();
  const channelId = params.id;
  const isEdit = channelId !== undefined;
  const [loading, setLoading] = useState(isEdit);
  const handleCancel = () => {
    navigate('/channel');
  };

  const originInputs = {
    name: '',
    type: 1,
    key: '',
    base_url: '',
    other: '',
    model_mapping: '',
    system_prompt: '',
    models: [],
    groups: ['default']
  };
  const [batch, setBatch] = useState(false);
  const [inputs, setInputs] = useState(originInputs);
  const [originModelOptions, setOriginModelOptions] = useState([]);
  const [modelOptions, setModelOptions] = useState([]);
  const [groupOptions, setGroupOptions] = useState([]);
  const [basicModels, setBasicModels] = useState([]);
  const [fullModels, setFullModels] = useState([]);
  const [customModel, setCustomModel] = useState('');
  const [config, setConfig] = useState({
    region: '',
    sk: '',
    ak: '',
    user_id: '',
    vertex_ai_project_id: '',
    vertex_ai_adc: ''
  });
  const handleInputChange = (e, { name, value }) => {
    setInputs((inputs) => ({ ...inputs, [name]: value }));
    if (name === 'type') {
      let localModels = getChannelModels(value);
      if (inputs.models.length === 0) {
        setInputs((inputs) => ({ ...inputs, models: localModels }));
      }
      setBasicModels(localModels);
    }
  };

  const handleConfigChange = (e, { name, value }) => {
    setConfig((inputs) => ({ ...inputs, [name]: value }));
  };

  const loadChannel = async () => {
    let res = await API.get(`/api/channel/${channelId}`);
    const { success, message, data } = res.data;
    if (success) {
      if (data.models === '') {
        data.models = [];
      } else {
        data.models = data.models.split(',');
      }
      if (data.group === '') {
        data.groups = [];
      } else {
        data.groups = data.group.split(',');
      }
      if (data.model_mapping !== '') {
        data.model_mapping = JSON.stringify(JSON.parse(data.model_mapping), null, 2);
      }
      setInputs(data);
      if (data.config !== '') {
        setConfig(JSON.parse(data.config));
      }
      setBasicModels(getChannelModels(data.type));
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const fetchModels = async () => {
    try {
      let res = await API.get(`/api/channel/models`);
      let localModelOptions = res.data.data.map((model) => ({
        key: model.id,
        text: model.id,
        value: model.id
      }));
      setOriginModelOptions(localModelOptions);
      setFullModels(res.data.data.map((model) => model.id));
    } catch (error) {
      showError(error.message);
    }
  };

  const fetchGroups = async () => {
    try {
      let res = await API.get(`/api/group/`);
      setGroupOptions(res.data.data.map((group) => ({
        key: group,
        text: group,
        value: group
      })));
    } catch (error) {
      showError(error.message);
    }
  };

  useEffect(() => {
    let localModelOptions = [...originModelOptions];
    inputs.models.forEach((model) => {
      if (!localModelOptions.find((option) => option.key === model)) {
        localModelOptions.push({
          key: model,
          text: model,
          value: model
        });
      }
    });
    setModelOptions(localModelOptions);
  }, [originModelOptions, inputs.models]);

  useEffect(() => {
    if (isEdit) {
      loadChannel().then();
    } else {
      let localModels = getChannelModels(inputs.type);
      setBasicModels(localModels);
    }
    fetchModels().then();
    fetchGroups().then();
  }, []);

  const submit = async () => {
    if (inputs.key === '') {
      if (config.ak !== '' && config.sk !== '' && config.region !== '') {
        inputs.key = `${config.ak}|${config.sk}|${config.region}`;
      } else if (config.region !== '' && config.vertex_ai_project_id !== '' && config.vertex_ai_adc !== '') {
        inputs.key = `${config.region}|${config.vertex_ai_project_id}|${config.vertex_ai_adc}`;
      }
    }
    if (!isEdit && (inputs.name === '' || inputs.key === '')) {
      showInfo('请填写チャネル名前和チャネルキー！');
      return;
    }
    if (inputs.type !== 43 && inputs.models.length === 0) {
      showInfo('请至少选择一个モデル！');
      return;
    }
    if (inputs.model_mapping !== '' && !verifyJSON(inputs.model_mapping)) {
      showInfo('モデルマッピングは有効なJSON形式である必要があります！');
      return;
    }
    let localInputs = {...inputs};
    if (localInputs.base_url && localInputs.base_url.endsWith('/')) {
      localInputs.base_url = localInputs.base_url.slice(0, localInputs.base_url.length - 1);
    }
    if (localInputs.type === 3 && localInputs.other === '') {
      localInputs.other = '2024-03-01-preview';
    }
    let res;
    localInputs.models = localInputs.models.join(',');
    localInputs.group = localInputs.groups.join(',');
    localInputs.config = JSON.stringify(config);
    if (isEdit) {
      res = await API.put(`/api/channel/`, { ...localInputs, id: parseInt(channelId) });
    } else {
      res = await API.post(`/api/channel/`, localInputs);
    }
    const { success, message } = res.data;
    if (success) {
      if (isEdit) {
        showSuccess('チャネルの更新に成功しました！');
      } else {
        showSuccess('チャネルの作成に成功しました！');
        setInputs(originInputs);
      }
    } else {
      showError(message);
    }
  };

  const addCustomModel = () => {
    if (customModel.trim() === '') return;
    if (inputs.models.includes(customModel)) return;
    let localModels = [...inputs.models];
    localModels.push(customModel);
    let localModelOptions = [];
    localModelOptions.push({
      key: customModel,
      text: customModel,
      value: customModel
    });
    setModelOptions(modelOptions => {
      return [...modelOptions, ...localModelOptions];
    });
    setCustomModel('');
    handleInputChange(null, { name: 'models', value: localModels });
  };

  return (
    <>
      <Segment loading={loading}>
        <Header as='h3'>{isEdit ? 'チャネル情報を更新' : '新しいチャネルを作成'}</Header>
        <Form autoComplete='new-password'>
          <Form.Field>
            <Form.Select
              label='タイプ'
              name='type'
              required
              search
              options={CHANNEL_OPTIONS}
              value={inputs.type}
              onChange={handleInputChange}
            />
          </Form.Field>
          {
            inputs.type === 3 && (
              <>
                <Message>
                  注意：<strong>モデルデプロイ名はモデル名と一致している必要があります</strong>。One APIはリクエストボディ内のmodelを使用するため
                  パラメータをデプロイ名に置き換えます（モデル名の中のドットは削除されます），<a target='_blank'
                                                                    href='https://github.com/songquanpeng/one-api/issues/133?notification_referrer_id=NT_kwDOAmJSYrM2NjIwMzI3NDgyOjM5OTk4MDUw#issuecomment-1571602271'>画像デモ</a>。
                </Message>
                <Form.Field>
                  <Form.Input
                    label='AZURE_OPENAI_ENDPOINT'
                    name='base_url'
                    placeholder={'AZURE_OPENAI_ENDPOINTを入力してください，例：：https://docs-test-001.openai.azure.com'}
                    onChange={handleInputChange}
                    value={inputs.base_url}
                    autoComplete='new-password'
                  />
                </Form.Field>
                <Form.Field>
                  <Form.Input
                    label='デフォルト API バージョン'
                    name='other'
                    placeholder={'请入力デフォルト API バージョン，例：：2024-03-01-preview，该配置可以被实际的请求検索参数所覆盖'}
                    onChange={handleInputChange}
                    value={inputs.other}
                    autoComplete='new-password'
                  />
                </Form.Field>
              </>
            )
          }
          {
            inputs.type === 8 && (
              <Form.Field>
                <Form.Input
                  label='Base URL'
                  name='base_url'
                  placeholder={'カスタムチャネルのベースURLを入力してください，例：：https://openai.justsong.cn'}
                  onChange={handleInputChange}
                  value={inputs.base_url}
                  autoComplete='new-password'
                />
              </Form.Field>
            )
          }
          <Form.Field>
            <Form.Input
              label='名前'
              required
              name='name'
              placeholder={'チャネルに名前を付けてください'}
              onChange={handleInputChange}
              value={inputs.name}
              autoComplete='new-password'
            />
          </Form.Field>
          <Form.Field>
            <Form.Dropdown
              label='グループ'
              placeholder={'请选择可以使用该チャネル的グループ'}
              name='groups'
              required
              fluid
              multiple
              selection
              allowAdditions
              additionLabel={'システム設定ページでグループレートを編集して、新しいグループを追加してください：'}
              onChange={handleInputChange}
              value={inputs.groups}
              autoComplete='new-password'
              options={groupOptions}
            />
          </Form.Field>
          {
            inputs.type === 18 && (
              <Form.Field>
                <Form.Input
                  label='モデルバージョン'
                  name='other'
                  placeholder={'星火大規模モデルのバージョンを入力してください。インターフェースアドレスのバージョン番号であることに注意してください。例：v2.1'}
                  onChange={handleInputChange}
                  value={inputs.other}
                  autoComplete='new-password'
                />
              </Form.Field>
            )
          }
          {
            inputs.type === 21 && (
              <Form.Field>
                <Form.Input
                  label='知识库 ID'
                  name='other'
                  placeholder={'请入力知识库 ID，例：：123456'}
                  onChange={handleInputChange}
                  value={inputs.other}
                  autoComplete='new-password'
                />
              </Form.Field>
            )
          }
          {
            inputs.type === 17 && (
              <Form.Field>
                <Form.Input
                  label='插件参数'
                  name='other'
                  placeholder={'请入力插件参数，即 X-DashScope-Plugin 请求头的取值'}
                  onChange={handleInputChange}
                  value={inputs.other}
                  autoComplete='new-password'
                />
              </Form.Field>
            )
          }
          {
            inputs.type === 34 && (
              <Message>
                对于 Coze 而言，モデル名即 Bot ID，你可以添加一个前缀 `bot-`，例：：`bot-123456`。
              </Message>
            )
          }
          {
            inputs.type === 40 && (
              <Message>
                对于豆包而言，需要手动去 <a target="_blank" href="https://console.volcengine.com/ark/region:ark+cn-beijing/endpoint">モデル推理页面</a> 创建推理接入点，以接入点名前作为モデル名，例：：`ep-20240608051426-tkxvl`。
              </Message>
            )
          }
          {
            inputs.type !== 43 && (
              <Form.Field>
                <Form.Dropdown
                  label='モデル'
                  placeholder={'このチャネルでサポートされているモデルを選択してください'}
                  name='models'
                  required
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
            )
          }
          {
            inputs.type !== 43 && (
              <div style={{ lineHeight: '40px', marginBottom: '12px' }}>
                <Button type={'button'} onClick={() => {
                  handleInputChange(null, { name: 'models', value: basicModels });
                }}>填入相关モデル</Button>
                <Button type={'button'} onClick={() => {
                  handleInputChange(null, { name: 'models', value: fullModels });
                }}>すべてのモデルを入力</Button>
                <Button type={'button'} onClick={() => {
                  handleInputChange(null, { name: 'models', value: [] });
                }}>すべてのモデルをクリア</Button>
                <Input
                  action={
                    <Button type={'button'} onClick={addCustomModel}>填入</Button>
                  }
                  placeholder='入力カスタムモデル名'
                  value={customModel}
                  onChange={(e, { value }) => {
                    setCustomModel(value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addCustomModel();
                      e.preventDefault();
                    }
                  }}
                />
              </div>
            )
          }
          {
          inputs.type !== 43 && (<>
              <Form.Field>
                <Form.TextArea
                  label='モデルリダイレクト'
                  placeholder={`これはオプションです。リクエストボディ内のモデル名を変更するために使用されます。JSON文字列で、キーはリクエスト内のモデル名、値は置き換えるモデル名です。例：\n${JSON.stringify(MODEL_MAPPING_EXAMPLE, null, 2)}`}
                  name='model_mapping'
                  onChange={handleInputChange}
                  value={inputs.model_mapping}
                  style={{ minHeight: 150, fontFamily: 'JetBrains Mono, Consolas' }}
                  autoComplete='new-password'
                />
              </Form.Field>
            <Form.Field>
                <Form.TextArea
                  label='系统プロンプト词'
                  placeholder={`此项可选，用于强制設定给定的系统プロンプト词，请配合カスタムモデル & モデルリダイレクト使用，首先创建一个唯一的カスタムモデル名并在上面填入，之后将该カスタムモデルリダイレクト映射到该チャネル一个原生支持的モデル`}
                  name='system_prompt'
                  onChange={handleInputChange}
                  value={inputs.system_prompt}
                  style={{ minHeight: 150, fontFamily: 'JetBrains Mono, Consolas' }}
                  autoComplete='new-password'
                />
              </Form.Field>
              </>
            )
          }
          {
            inputs.type === 33 && (
              <Form.Field>
                <Form.Input
                  label='Region'
                  name='region'
                  required
                  placeholder={'region，e.g. us-west-2'}
                  onChange={handleConfigChange}
                  value={config.region}
                  autoComplete=''
                />
                <Form.Input
                  label='AK'
                  name='ak'
                  required
                  placeholder={'AWS IAM Access Key'}
                  onChange={handleConfigChange}
                  value={config.ak}
                  autoComplete=''
                />
                <Form.Input
                  label='SK'
                  name='sk'
                  required
                  placeholder={'AWS IAM Secret Key'}
                  onChange={handleConfigChange}
                  value={config.sk}
                  autoComplete=''
                />
              </Form.Field>
            )
          }
          {
            inputs.type === 42 && (
              <Form.Field>
                <Form.Input
                  label='Region'
                  name='region'
                  required
                  placeholder={'Vertex AI Region.g. us-east5'}
                  onChange={handleConfigChange}
                  value={config.region}
                  autoComplete=''
                />
                <Form.Input
                  label='Vertex AI Project ID'
                  name='vertex_ai_project_id'
                  required
                  placeholder={'Vertex AI Project ID'}
                  onChange={handleConfigChange}
                  value={config.vertex_ai_project_id}
                  autoComplete=''
                />
                <Form.Input
                  label='Google Cloud Application Default Credentials JSON'
                  name='vertex_ai_adc'
                  required
                  placeholder={'Google Cloud Application Default Credentials JSON'}
                  onChange={handleConfigChange}
                  value={config.vertex_ai_adc}
                  autoComplete=''
                />
              </Form.Field>
            )
          }
          {
            inputs.type === 34 && (
              <Form.Input
                label='User ID'
                name='user_id'
                required
                placeholder={'生成该キー的ユーザー ID'}
                onChange={handleConfigChange}
                value={config.user_id}
                autoComplete=''
              />)
          }
          {
            inputs.type !== 33 && inputs.type !== 42 && (batch ? <Form.Field>
              <Form.TextArea
                label='キー'
                name='key'
                required
                placeholder={'キーを入力してください。1行に1つ'}
                onChange={handleInputChange}
                value={inputs.key}
                style={{ minHeight: 150, fontFamily: 'JetBrains Mono, Consolas' }}
                autoComplete='new-password'
              />
            </Form.Field> : <Form.Field>
              <Form.Input
                label='キー'
                name='key'
                required
                placeholder={type2secretPrompt(inputs.type)}
                onChange={handleInputChange}
                value={inputs.key}
                autoComplete='new-password'
              />
            </Form.Field>)
          }
          {
            inputs.type === 37 && (
              <Form.Field>
                <Form.Input
                  label='Account ID'
                  name='user_id'
                  required
                  placeholder={'请入力 Account ID，例：：d8d7c61dbc334c32d3ced580e4bf42b4'}
                  onChange={handleConfigChange}
                  value={config.user_id}
                  autoComplete=''
                />
              </Form.Field>
            )
          }
          {
            inputs.type !== 33 && !isEdit && (
              <Form.Checkbox
                checked={batch}
                label='バッチ作成'
                name='batch'
                onChange={() => setBatch(!batch)}
              />
            )
          }
          {
            inputs.type !== 3 && inputs.type !== 33 && inputs.type !== 8 && inputs.type !== 22 && (
              <Form.Field>
                <Form.Input
                  label='プロキシ'
                  name='base_url'
                  placeholder={'これはオプションです。プロキシサイト経由でAPI呼び出しを行うために使用されます。プロキシサイトのアドレスを入力してください。形式：https://domain.com'}
                  onChange={handleInputChange}
                  value={inputs.base_url}
                  autoComplete='new-password'
                />
              </Form.Field>
            )
          }
          {
            inputs.type === 22 && (
              <Form.Field>
                <Form.Input
                  label='私有部署地址'
                  name='base_url'
                  placeholder={'请入力私有部署地址，格式为：https://fastgpt.run/api/openapi'}
                  onChange={handleInputChange}
                  value={inputs.base_url}
                  autoComplete='new-password'
                />
              </Form.Field>
            )
          }
          <Button onClick={handleCancel}>キャンセル</Button>
          <Button type={isEdit ? 'button' : 'submit'} positive onClick={submit}>送信</Button>
        </Form>
      </Segment>
    </>
  );
};

export default EditChannel;
