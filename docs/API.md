# 使用 API 操控 & 扩展 One API
> 欢迎送信 PR 在此放上你的拓展项目。

例：，虽然 One API 本身没有直接支持支付，但是你可以通过系统扩展的 API 来实现支付功能。

又或者你想カスタムチャネル管理策略，也可以通过 API 来实现チャネル的無効化与有効化。

## 鉴权
One API 支持两种鉴权方式：Cookie 和 Token，对于 Token，参照下图获取：

![image](https://github.com/songquanpeng/songquanpeng.github.io/assets/39998050/c15281a7-83ed-47cb-a1f6-913cb6bf4a7c)

之后，将 Token 作为请求头的 Authorization 字段的值即可，例：下面使用 Token 调用テストチャネル的 API：
![image](https://github.com/songquanpeng/songquanpeng.github.io/assets/39998050/1273b7ae-cb60-4c0d-93a6-b1cbc039c4f8)

## 请求格式与响应格式
One API 使用 JSON 格式进行请求和响应。

对于响应体，一般格式如下：
```json
{
  "message": "请求信息",
  "success": true,
  "data": {}
}
```

## API 列表
> 当前 API 列表不全，请自行通过浏览器抓取前端请求

如果现有的 API 没有办法满足你的需求，欢迎送信 issue 讨论。

### 获取当前ログインユーザー信息
**GET** `/api/user/self`

### 为给定ユーザーチャージ割り当て
**POST** `/api/topup`
```json
{
  "user_id": 1,
  "quota": 100000,
  "remark": "チャージ 100000 割り当て"
}
```

## 其他
### チャージリンク上的附加参数
One API 会在ユーザー点击チャージ按钮的时候，将ユーザー的信息和チャージ信息附加在链接上，例：：
`https://example.com?username=root&user_id=1&transaction_id=4b3eed80-55d5-443f-bd44-fb18c648c837`

你可以通过解析链接上的参数来获取ユーザー信息和チャージ信息，然后调用 API 来为ユーザーチャージ。

注意：不是所有主题都支持该功能，欢迎 PR 补齐。