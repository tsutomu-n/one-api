# One API 前端界面

这个项目是 One API 的前端界面，它基于 [Berry Free React Admin Template](https://github.com/codedthemes/berry-free-react-admin-template) 进行开发。

## 使用的开源项目

使用了以下开源项目作为我们项目的一部分：

- [Berry Free React Admin Template](https://github.com/codedthemes/berry-free-react-admin-template)
- [minimal-ui-kit](minimal-ui-kit)

## 开发说明

当新しいチャネルを追加时，需要修改以下地方：

1. `web/berry/src/constants/ChannelConstants.js`

在该文件中的 `CHANNEL_OPTIONS` 新しいチャネルを追加

```js
export const CHANNEL_OPTIONS = {
  //key 为チャネルID
  1: {
    key: 1, // チャネルID
    text: "OpenAI", // チャネル名前
    value: 1, // チャネルID
    color: "primary", // チャネル列表显示的颜色
  },
};
```

2. `web/berry/src/views/Channel/type/Config.js`

在该文件中的`typeConfig`新しいチャネルを追加配置， 如果なし需配置，可以不添加

```js
const typeConfig = {
  // key 为チャネルID
  3: {
    inputLabel: {
      // 入力框名前 配置
      // 对应的字段名前
      base_url: "AZURE_OPENAI_ENDPOINT",
      other: "デフォルト API バージョン",
    },
    prompt: {
      // 入力框プロンプト 配置
      // 对应的字段名前
      base_url: "请填写AZURE_OPENAI_ENDPOINT",

      // 注意：通过判断 `other` 是否有值来判断是否需要显示 `other` 入力框， デフォルト是没有值的
      other: "请入力デフォルトAPIバージョン，例：：2024-03-01-preview",
    },
    modelGroup: "openai", // モデル组名前,这个值是给 填入チャネル支持モデル 按钮使用的。 填入チャネル支持モデル 按钮会根据这个值来获取モデル组，如果填写デフォルト是 openai
  },
};
```

## 许可证

本项目中使用的代码遵循 MIT 许可证。
