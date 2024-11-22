const defaultConfig = {
  input: {
    name: '',
    type: 1,
    key: '',
    base_url: '',
    other: '',
    model_mapping: '',
    models: [],
    groups: ['default'],
    config: {}
  },
  inputLabel: {
    name: 'チャネル名前',
    type: 'チャネルタイプ',
    base_url: 'チャネルAPI地址',
    key: 'キー',
    other: '其他参数',
    models: 'モデル',
    model_mapping: 'モデルマッピング关系',
    system_prompt: '系统プロンプト词',
    groups: 'ユーザー组',
    config: null
  },
  prompt: {
    type: '请选择チャネルタイプ',
    name: 'チャネルに名前を付けてください',
    base_url: '可空，请入力中转API地址，例：通过cloudflare中转',
    key: 'チャネルに対応する認証キーを入力してください',
    other: '',
    models: 'このチャネルでサポートされているモデルを選択してください',
    model_mapping:
      '请入力要修改的モデルマッピング关系，格式为：api请求モデルID:实际转发给チャネル的モデルID，使用JSON数组表示，例：：{"gpt-3.5": "gpt-35"}',
    system_prompt:"此项可选，用于强制設定给定的系统プロンプト词，请配合カスタムモデル & モデルリダイレクト使用，首先创建一个唯一的カスタムモデル名并在上面填入，之后将该カスタムモデルリダイレクト映射到该チャネル一个原生支持的モデル此项可选，用于强制設定给定的系统プロンプト词，请配合カスタムモデル & モデルリダイレクト使用，首先创建一个唯一的カスタムモデル名并在上面填入，之后将该カスタムモデルリダイレクト映射到该チャネル一个原生支持的モデル",
    groups: '请选择该チャネル所支持的ユーザー组',
    config: null
  },
  modelGroup: 'openai'
};

const typeConfig = {
  3: {
    inputLabel: {
      base_url: 'AZURE_OPENAI_ENDPOINT',
      other: 'デフォルト API バージョン'
    },
    prompt: {
      base_url: '请填写AZURE_OPENAI_ENDPOINT',
      other: '请入力デフォルトAPIバージョン，例：：2024-03-01-preview'
    }
  },
  11: {
    input: {
      models: ['PaLM-2']
    },
    modelGroup: 'google palm'
  },
  14: {
    input: {
      models: ['claude-instant-1', 'claude-2', 'claude-2.0', 'claude-2.1']
    },
    modelGroup: 'anthropic'
  },
  15: {
    input: {
      models: ['ERNIE-Bot', 'ERNIE-Bot-turbo', 'ERNIE-Bot-4', 'Embedding-V1']
    },
    prompt: {
      key: '次の形式で入力してください：APIKey|SecretKey'
    },
    modelGroup: 'baidu'
  },
  16: {
    input: {
      models: ['glm-4', 'glm-4v', 'glm-3-turbo', 'chatglm_turbo', 'chatglm_pro', 'chatglm_std', 'chatglm_lite']
    },
    modelGroup: 'zhipu'
  },
  17: {
    inputLabel: {
      other: '插件参数'
    },
    input: {
      models: ['qwen-turbo', 'qwen-plus', 'qwen-max', 'qwen-max-longcontext', 'text-embedding-v1']
    },
    prompt: {
      other: '请入力插件参数，即 X-DashScope-Plugin 请求头的取值'
    },
    modelGroup: 'ali'
  },
  18: {
    inputLabel: {
      other: 'バージョン号'
    },
    input: {
      models: ['SparkDesk', 'SparkDesk-v1.1', 'SparkDesk-v2.1', 'SparkDesk-v3.1', 'SparkDesk-v3.1-128K', 'SparkDesk-v3.5', 'SparkDesk-v3.5-32K', 'SparkDesk-v4.0']
    },
    prompt: {
      key: '次の形式で入力してください：APPID|APISecret|APIKey',
      other: '请入力バージョン号，例：：v3.1'
    },
    modelGroup: 'xunfei'
  },
  19: {
    input: {
      models: ['360GPT_S2_V9', 'embedding-bert-512-v1', 'embedding_s1_v1', 'semantic_similarity_s1_v1']
    },
    modelGroup: '360'
  },
  22: {
    prompt: {
      key: '次の形式で入力してください：APIKey-AppId，例：：fastgpt-0sp2gtvfdgyi4k30jwlgwf1i-64f335d84283f05518e9e041'
    }
  },
  23: {
    input: {
      models: ['hunyuan']
    },
    prompt: {
      key: '次の形式で入力してください：AppId|SecretId|SecretKey'
    },
    modelGroup: 'tencent'
  },
  24: {
    inputLabel: {
      other: 'バージョン号'
    },
    input: {
      models: ['gemini-pro']
    },
    prompt: {
      other: '请入力バージョン号，例：：v1'
    },
    modelGroup: 'google gemini'
  },
  25: {
    input: {
      models: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k']
    },
    modelGroup: 'moonshot'
  },
  26: {
    input: {
      models: ['Baichuan2-Turbo', 'Baichuan2-Turbo-192k', 'Baichuan-Text-Embedding']
    },
    modelGroup: 'baichuan'
  },
  27: {
    input: {
      models: ['abab5.5s-chat', 'abab5.5-chat', 'abab6-chat']
    },
    modelGroup: 'minimax'
  },
  29: {
    modelGroup: 'groq'
  },
  30: {
    modelGroup: 'ollama'
  },
  31: {
    modelGroup: 'lingyiwanwu'
  },
  33: {
    inputLabel: {
      key: '',
      config: {
        region: 'Region',
        ak: 'Access Key',
        sk: 'Secret Key'
      }
    },
    prompt: {
      key: '',
      config: {
        region: 'region，e.g. us-west-2',
        ak: 'AWS IAM Access Key',
        sk: 'AWS IAM Secret Key'
      }
    },
    modelGroup: 'anthropic'
  },
  37: {
    inputLabel: {
      config: {
        user_id: 'Account ID'
      }
    },
    prompt: {
      config: {
        user_id: '请入力 Account ID，例：：d8d7c61dbc334c32d3ced580e4bf42b4'
      }
    },
    modelGroup: 'Cloudflare'
  },
  34: {
    inputLabel: {
      config: {
        user_id: 'User ID'
      }
    },
    prompt: {
      models: '对于 Coze 而言，モデル名即 Bot ID，你可以添加一个前缀 `bot-`，例：：`bot-123456`',
      config: {
        user_id: '生成该キー的ユーザー ID'
      }
    },
    modelGroup: 'Coze'
  },
  42: {
    inputLabel: {
      key: '',
      config: {
        region: 'Vertex AI Region',
        vertex_ai_project_id: 'Vertex AI Project ID',
        vertex_ai_adc: 'Google Cloud Application Default Credentials JSON'
      }
    },
    prompt: {
      key: '',
      config: {
        region: 'Vertex AI Region.g. us-east5',
        vertex_ai_project_id: 'Vertex AI Project ID',
        vertex_ai_adc: 'Google Cloud Application Default Credentials JSON: https://cloud.google.com/docs/authentication/application-default-credentials'
      }
    },
    modelGroup: 'anthropic'
  },
  45: {
    modelGroup: 'xai'
  },
};

export { defaultConfig, typeConfig };
