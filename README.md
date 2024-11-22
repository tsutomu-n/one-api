<p align="right">
   <strong>中文</strong> | <a href="./README.en.md">English</a> | <a href="./README.ja.md">日本語</a>
</p>


<p align="center">
  <a href="https://github.com/songquanpeng/one-api"><img src="https://raw.githubusercontent.com/songquanpeng/one-api/main/web/default/public/logo.png" width="150" height="150" alt="one-api logo"></a>
</p>

<div align="center">

# One API

_✨ 通过标准的 OpenAI API 格式访问所有的大モデル，开箱即用 ✨_

</div>

<p align="center">
  <a href="https://raw.githubusercontent.com/songquanpeng/one-api/main/LICENSE">
    <img src="https://img.shields.io/github/license/songquanpeng/one-api?color=brightgreen" alt="license">
  </a>
  <a href="https://github.com/songquanpeng/one-api/releases/latest">
    <img src="https://img.shields.io/github/v/release/songquanpeng/one-api?color=brightgreen&include_prereleases" alt="release">
  </a>
  <a href="https://hub.docker.com/repository/docker/justsong/one-api">
    <img src="https://img.shields.io/docker/pulls/justsong/one-api?color=brightgreen" alt="docker pull">
  </a>
  <a href="https://github.com/songquanpeng/one-api/releases/latest">
    <img src="https://img.shields.io/github/downloads/songquanpeng/one-api/total?color=brightgreen&include_prereleases" alt="release">
  </a>
  <a href="https://goreportcard.com/report/github.com/songquanpeng/one-api">
    <img src="https://goreportcard.com/badge/github.com/songquanpeng/one-api" alt="GoReportCard">
  </a>
</p>

<p align="center">
  <a href="https://github.com/songquanpeng/one-api#部署">部署教程</a>
  ·
  <a href="https://github.com/songquanpeng/one-api#使用方法">使用方法</a>
  ·
  <a href="https://github.com/songquanpeng/one-api/issues">意见反馈</a>
  ·
  <a href="https://github.com/songquanpeng/one-api#截图展示">截图展示</a>
  ·
  <a href="https://openai.justsong.cn/">在线演示</a>
  ·
  <a href="https://github.com/songquanpeng/one-api#常见问题">常见问题</a>
  ·
  <a href="https://github.com/songquanpeng/one-api#相关项目">相关项目</a>
  ·
  <a href="https://iamazing.cn/page/reward">赞赏支持</a>
</p>

> [!NOTE]
> 本项目为开源项目，使用者必须在遵循 OpenAI 的[使用条款](https://openai.com/policies/terms-of-use)以及**法律法规**的情况下使用，不得用于非法用途。
>
> 根据[《生成式人工智能服务管理暂行办法》](http://www.cac.gov.cn/2023-07/13/c_1690898327029107.htm)的要求，请勿对中国地区公众提供一切未经备案的生成式人工智能服务。

> [!WARNING]
> 使用 Docker 拉取的最新ミラー可能是 `alpha` バージョン，如果追求稳定性请手动指定バージョン。

> [!WARNING]
> 使用 root ユーザー初次ログイン系统后，务必修改デフォルトパスワード `123456`！

## 功能
1. 支持多种大モデル：
   + [x] [OpenAI ChatGPT 系列モデル](https://platform.openai.com/docs/guides/gpt/chat-completions-api)（支持 [Azure OpenAI API](https://learn.microsoft.com/en-us/azure/ai-services/openai/reference)）
   + [x] [Anthropic Claude 系列モデル](https://anthropic.com) (支持 AWS Claude)
   + [x] [Google PaLM2/Gemini 系列モデル](https://developers.generativeai.google)
   + [x] [Mistral 系列モデル](https://mistral.ai/)
   + [x] [字节跳动豆包大モデル](https://console.volcengine.com/ark/region:ark+cn-beijing/model)
   + [x] [百度文心一言系列モデル](https://cloud.baidu.com/doc/WENXINWORKSHOP/index.html)
   + [x] [阿里通义千问系列モデル](https://help.aliyun.com/document_detail/2400395.html)
   + [x] [讯飞星火认知大モデル](https://www.xfyun.cn/doc/spark/Web.html)
   + [x] [智谱 ChatGLM 系列モデル](https://bigmodel.cn)
   + [x] [360 智脑](https://ai.360.cn)
   + [x] [腾讯混元大モデル](https://cloud.tencent.com/document/product/1729)
   + [x] [Moonshot AI](https://platform.moonshot.cn/)
   + [x] [百川大モデル](https://platform.baichuan-ai.com)
   + [x] [MINIMAX](https://api.minimax.chat/)
   + [x] [Groq](https://wow.groq.com/)
   + [x] [Ollama](https://github.com/ollama/ollama)
   + [x] [零一万物](https://platform.lingyiwanwu.com/)
   + [x] [阶跃星辰](https://platform.stepfun.com/)
   + [x] [Coze](https://www.coze.com/)
   + [x] [Cohere](https://cohere.com/)
   + [x] [DeepSeek](https://www.deepseek.com/)
   + [x] [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)
   + [x] [DeepL](https://www.deepl.com/)
   + [x] [together.ai](https://www.together.ai/)
   + [x] [novita.ai](https://www.novita.ai/)
   + [x] [硅基流动 SiliconCloud](https://siliconflow.cn/siliconcloud)
   + [x] [xAI](https://x.ai/)
2. 支持配置ミラー以及众多[第三方プロキシ服务](https://iamazing.cn/page/openai-api-third-party-services)。
3. 支持通过**负载均衡**的方式访问多个チャネル。
4. 支持 **stream 模式**，可以通过流式传输实现打字机效果。
5. 支持**多机部署**，[详见此处](#多机部署)。
6. 支持**APIキー管理**，設定APIキー的有効期限、割り当て、允许的 IP 范围以及允许的モデル访问。
7. 支持**交換コード管理**，支持批量生成和导出交換コード，可使用交換コード为账户进行チャージ。
8. 支持**チャネル管理**，バッチ作成チャネル。
9. 支持**ユーザーグループ**以及**チャネルグループ**，支持为不同グループ設定不同的倍率。
10. 支持チャネル**設定モデル列表**。
11. 支持**查看割り当て詳細**。
12. 支持**ユーザー邀请奖励**。
13. 支持以美元为单位显示割り当て。
14. 支持发布お知らせ，設定チャージリンク，設定新規ユーザーの初期割り当て。
15. 支持モデルマッピング，重定向ユーザー的请求モデル，如なし必要请不要設定，設定之后会导致请求体被重新构造而非直接透传，会导致部分还未正式支持的字段なし法传递成功。
16. 支持失败自动重试。
17. 支持绘图接口。
18. 支持 [Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/providers/openai/)，チャネル設定的プロキシ部分填写 `https://gateway.ai.cloudflare.com/v1/ACCOUNT_TAG/GATEWAY/openai` 即可。
19. 支持丰富的**カスタム**設定，
    1. 支持カスタムシステム名，logo 以及フッター。
    2. 支持カスタムホーム和バージョン情報页面，可以选择使用 HTML & Markdown 代码进行カスタム，或者使用一个单独的网页通过 iframe 嵌入。
20. 支持通过系统访问APIキー调用管理 API，进而**在なし需二开的情况下扩展和カスタム** One API 的功能，詳細请参考此处 [API 文档](./docs/API.md)。。
21. 支持 Cloudflare Turnstileユーザー検証。
22. 支持ユーザー管理，支持**多种ユーザーログイン登録方式**：
    + 邮箱ログイン登録（支持登録邮箱白名单）以及通过邮箱进行パスワードリセット。
    + 支持使用飞书进行授权ログイン。
    + [GitHub 开放授权](https://github.com/settings/applications/new)。
    + 微信公众号授权（需要额外部署 [WeChat Server](https://github.com/songquanpeng/wechat-server)）。
23. 支持主题切换，設定环境变量 `THEME` 即可，デフォルト为 `default`，欢迎 PR 更多主题，具体参考[此处](./web/README.md)。
24. 配合 [Message Pusher](https://github.com/songquanpeng/message-pusher) 可将报警信息推送到多种 App 上。

## 部署
### 基于 Docker 进行部署
```shell
# 使用 SQLite 的部署命令：
docker run --name one-api -d --restart always -p 3000:3000 -e TZ=Asia/Shanghai -v /home/ubuntu/data/one-api:/data justsong/one-api
# 使用 MySQL 的部署命令，在上面的基础上添加 `-e SQL_DSN="root:123456@tcp(localhost:3306)/oneapi"`，请自行修改数据库连接参数，不清楚如何修改请参见下面环境变量一节。
# 例：：
docker run --name one-api -d --restart always -p 3000:3000 -e SQL_DSN="root:123456@tcp(localhost:3306)/oneapi" -e TZ=Asia/Shanghai -v /home/ubuntu/data/one-api:/data justsong/one-api
```

其中，`-p 3000:3000` 中的第一个 `3000` 是宿主机的端口，可以根据需要进行修改。

数据和ログ将会保存在宿主机的 `/home/ubuntu/data/one-api` 目录，请确保该目录存在且具有写入权限，或者更改为合适的目录。

如果启动失败，请添加 `--privileged=true`，具体参考 https://github.com/songquanpeng/one-api/issues/482 。

如果上面的ミラーなし法拉取，可以尝试使用 GitHub 的 Docker ミラー，将上面的 `justsong/one-api` 替换为 `ghcr.io/songquanpeng/one-api` 即可。

如果你的并发量较大，**务必**設定 `SQL_DSN`，详见下面[环境变量](#环境变量)一节。

更新命令：`docker run --rm -v /var/run/docker.sock:/var/run/docker.sock containrrr/watchtower -cR`

Nginx 的参考配置：
```
server{
   server_name openai.justsong.cn;  # 请根据实际情况修改你的域名

   location / {
          client_max_body_size  64m;
          proxy_http_version 1.1;
          proxy_pass http://localhost:3000;  # 请根据实际情况修改你的端口
          proxy_set_header Host $host;
          proxy_set_header X-Forwarded-For $remote_addr;
          proxy_cache_bypass $http_upgrade;
          proxy_set_header Accept-Encoding gzip;
          proxy_read_timeout 300s;  # GPT-4 需要较长的超时時間，请自行调整
   }
}
```

之后使用 Let's Encrypt 的 certbot 配置 HTTPS：
```bash
# Ubuntu 安装 certbot：
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
# 生成证书 & 修改 Nginx 配置
sudo certbot --nginx
# 根据指示进行操作
# 重启 Nginx
sudo service nginx restart
```

初始账号ユーザー名为 `root`，パスワード为 `123456`。


### 基于 Docker Compose 进行部署

> 仅启动方式不同，参数設定不变，请参考基于 Docker 部署部分

```shell
# 目前支持 MySQL 启动，数据存储在 ./data/mysql 文件夹内
docker-compose up -d

# 查看部署状態
docker-compose ps
```

### 手动部署
1. 从 [GitHub Releases](https://github.com/songquanpeng/one-api/releases/latest) 下载可执行文件或者从ソースコード编译：
   ```shell
   git clone https://github.com/songquanpeng/one-api.git

   # 构建前端
   cd one-api/web/default
   npm install
   npm run build

   # 构建后端
   cd ../..
   go mod download
   go build -ldflags "-s -w" -o one-api
   ````
2. 运行：
   ```shell
   chmod u+x one-api
   ./one-api --port 3000 --log-dir ./logs
   ```
3. 访问 [http://localhost:3000/](http://localhost:3000/) 并ログイン。初始账号ユーザー名为 `root`，パスワード为 `123456`。

更加详细的部署教程[参见此处](https://iamazing.cn/page/how-to-deploy-a-website)。

### 多机部署
1. 所有服务器 `SESSION_SECRET` 設定一样的值。
2. 必须設定 `SQL_DSN`，使用 MySQL 数据库而非 SQLite，所有服务器连接同一个数据库。
3. 所有从服务器必须設定 `NODE_TYPE` 为 `slave`，不設定则デフォルト为主服务器。
4. 設定 `SYNC_FREQUENCY` 后服务器将定期从数据库同步配置，在使用远程数据库的情况下，推荐設定该项并有効化 Redis，なし论主从。
5. 从服务器可以选择設定 `FRONTEND_BASE_URL`，以重定向页面请求到主服务器。
6. 从服务器上**分别**装好 Redis，設定好 `REDIS_CONN_STRING`，这样可以做到在缓存未过期的情况下数据库零访问，可以减少延迟。
7. 如果主服务器访问数据库延迟也比较高，则也需要有効化 Redis，并設定 `SYNC_FREQUENCY`，以定期从数据库同步配置。

环境变量的具体使用方法详见[此处](#环境变量)。

### 宝塔部署教程

详见 [#175](https://github.com/songquanpeng/one-api/issues/175)。

如果部署后访问出现空白页面，详见 [#97](https://github.com/songquanpeng/one-api/issues/97)。

### 部署第三方服务配合 One API 使用
> 欢迎 PR 添加更多示例。

#### ChatGPT Next Web
项目主页：https://github.com/Yidadaa/ChatGPT-Next-Web

```bash
docker run --name chat-next-web -d -p 3001:3000 yidadaa/chatgpt-next-web
```

注意修改端口号，之后在页面上設定接口地址（例：：https://openai.justsong.cn/ ）和 API Key 即可。

#### ChatGPT Web
项目主页：https://github.com/Chanzhaoyu/chatgpt-web

```bash
docker run --name chatgpt-web -d -p 3002:3002 -e OPENAI_API_BASE_URL=https://openai.justsong.cn -e OPENAI_API_KEY=sk-xxx chenzhaoyu94/chatgpt-web
```

注意修改端口号、`OPENAI_API_BASE_URL` 和 `OPENAI_API_KEY`。

#### QChatGPT - QQ机器人
项目主页：https://github.com/RockChinQ/QChatGPT

根据[文档](https://qchatgpt.rockchin.top)完成部署后，在 `data/provider.json`設定`requester.openai-chat-completions.base-url`为 One API 实例地址，并填写 API Key 到 `keys.openai` 组中，設定 `model` 为要使用的モデル名。

运行期间可以通过`!model`命令查看、切换可用モデル。

### 部署到第三方平台
<details>
<summary><strong>部署到 Sealos </strong></summary>
<div>

> Sealos 的服务器在国外，不需要额外处理网络问题，支持高并发 & 动态伸缩。

点击以下按钮一键部署（部署后访问出现 404 请等待 3~5 分钟）：

[![Deploy-on-Sealos.svg](https://raw.githubusercontent.com/labring-actions/templates/main/Deploy-on-Sealos.svg)](https://cloud.sealos.io/?openapp=system-fastdeploy?templateName=one-api)

</div>
</details>

<details>
<summary><strong>部署到 Zeabur</strong></summary>
<div>

> Zeabur 的服务器在国外，自动解决了网络的问题，同时免费的割り当て也足够个人使用

[![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com/templates/7Q0KO3)

1. 首先 fork 一份代码。
2. 进入 [Zeabur](https://zeabur.com?referralCode=songquanpeng)，ログイン，进入控制台。
3. 新建一个 Project，在 Service -> Add Service 选择 Marketplace，选择 MySQL，并记下连接参数（ユーザー名、パスワード、地址、端口）。
4. コピー链接参数，运行 ```create database `one-api` ``` 创建数据库。
5. 然后在 Service -> Add Service，选择 Git（第一次使用需要先授权），选择你 fork 的仓库。
6. Deploy 会自动开始，先キャンセル。进入下方 Variable，添加一个 `PORT`，值为 `3000`，再添加一个 `SQL_DSN`，值为 `<username>:<password>@tcp(<addr>:<port>)/one-api` ，然后保存。 注意如果不填写 `SQL_DSN`，数据将なし法持久化，重新部署后数据会丢失。
7. 选择 Redeploy。
8. 进入下方 Domains，选择一个合适的域名前缀，如 "my-one-api"，最终域名为 "my-one-api.zeabur.app"，也可以 CNAME 自己的域名。
9. 等待部署完成，点击生成的域名进入 One API。

</div>
</details>

<details>
<summary><strong>部署到 Render</strong></summary>
<div>

> Render 提供免费割り当て，绑卡后可以进一步昇格割り当て

Render 可以直接部署 docker ミラー，不需要 fork 仓库：https://dashboard.render.com

</div>
</details>

## 配置
系统本身开箱即用。

你可以通过設定环境变量或者命令行参数进行配置。

等到系统启动后，使用 `root` ユーザーログイン系统并做进一步的配置。

**Note**：如果你不知道某个配置项的含义，可以临时删掉值以看到进一步的プロンプト文字。

## 使用方法
在`チャネル`页面中添加你的 API Key，之后在`APIキー`页面中新增访问APIキー。

之后就可以使用你的APIキー访问 One API 了，使用方式与 [OpenAI API](https://platform.openai.com/docs/api-reference/introduction) 一致。

你需要在各种用到 OpenAI API 的地方設定 API Base 为你的 One API 的部署地址，例：：`https://openai.justsong.cn`，API Key 则为你在 One API 中生成的APIキー。

注意：具体的 API Base 的格式取决于你所使用的客户端。

例：对于 OpenAI 的官方库：
```bash
OPENAI_API_KEY="sk-xxxxxx"
OPENAI_API_BASE="https://<HOST>:<PORT>/v1"
```

```mermaid
graph LR
    A(ユーザー)
    A --->|使用 One API 分发的 key 进行请求| B(One API)
    B -->|中继请求| C(OpenAI)
    B -->|中继请求| D(Azure)
    B -->|中继请求| E(其他 OpenAI API 格式下游チャネル)
    B -->|中继并修改请求体和返回体| F(非 OpenAI API 格式下游チャネル)
```

可以通过在APIキー后面添加チャネル ID 的方式指定使用哪一个チャネル处理本次请求，例：：`Authorization: Bearer ONE_API_KEY-CHANNEL_ID`。
注意：需要是管理者ユーザー创建的APIキー才能指定チャネル ID。

不加的话将会使用负载均衡的方式使用多个チャネル。

### 环境变量
> One API 支持从 `.env` 文件中读取环境变量，请参照 `.env.example` 文件，使用时请将其重命名为 `.env`。
1. `REDIS_CONN_STRING`：設定之后将使用 Redis 作为缓存使用。
   + 例子：`REDIS_CONN_STRING=redis://default:redispw@localhost:49153`
   + 如果数据库访问延迟很低，没有必要有効化 Redis，有効化后反而会出现数据滞后的问题。
2. `SESSION_SECRET`：設定之后将使用固定的会话キー，这样系统重新启动后已ログインユーザー的 cookie 将依旧有效。
   + 例子：`SESSION_SECRET=random_string`
3. `SQL_DSN`：設定之后将使用指定数据库而非 SQLite，请使用 MySQL 或 PostgreSQL。
   + 例子：
     + MySQL：`SQL_DSN=root:123456@tcp(localhost:3306)/oneapi`
     + PostgreSQL：`SQL_DSN=postgres://postgres:123456@localhost:5432/oneapi`（适配中，欢迎反馈）
   + 注意需要提前建立数据库 `oneapi`，なし需手动建表，程序将自动建表。
   + 如果使用本地数据库：部署命令可添加 `--network="host"` 以使得容器内的程序可以访问到宿主机上的 MySQL。
   + 如果使用云数据库：如果云服务器需要验证身份，需要在连接参数中添加 `?tls=skip-verify`。
   + 请根据你的数据库配置修改下列参数（或者保持デフォルト值）：
     + `SQL_MAX_IDLE_CONNS`：最大空闲连接数，デフォルト为 `100`。
     + `SQL_MAX_OPEN_CONNS`：最大打开连接数，デフォルト为 `1000`。
       + 如果报错 `Error 1040: Too many connections`，请适当减小该值。
     + `SQL_CONN_MAX_LIFETIME`：连接的最大生命周期，デフォルト为 `60`，单位分钟。
4. `LOG_SQL_DSN`：設定之后将为 `logs` 表使用独立的数据库，请使用 MySQL 或 PostgreSQL。
5. `FRONTEND_BASE_URL`：設定之后将重定向页面请求到指定的地址，仅限从服务器設定。
   + 例子：`FRONTEND_BASE_URL=https://openai.justsong.cn`
6. `MEMORY_CACHE_ENABLED`：有効化内存缓存，会导致ユーザー割り当て的更新存在一定的延迟，オプション値为 `true` 和 `false`，未設定则デフォルト为 `false`。
   + 例子：`MEMORY_CACHE_ENABLED=true`
7. `SYNC_FREQUENCY`：在有効化缓存的情况下与数据库同步配置的频率，单位为秒，デフォルト为 `600`秒。
   + 例子：`SYNC_FREQUENCY=60`
8. `NODE_TYPE`：設定之后将指定节点タイプ，オプション値为 `master` 和 `slave`，未設定则デフォルト为 `master`。
   + 例子：`NODE_TYPE=slave`
9. `CHANNEL_UPDATE_FREQUENCY`：設定之后将定期更新チャネル残高，单位为分钟，未設定则不进行更新。
   + 例子：`CHANNEL_UPDATE_FREQUENCY=1440`
10. `CHANNEL_TEST_FREQUENCY`：設定之后将定期检查チャネル，单位为分钟，未設定则不进行检查。 
   +例子：`CHANNEL_TEST_FREQUENCY=1440`
11. `POLLING_INTERVAL`：批量更新チャネル残高以及テスト可用性时的请求间隔，单位为秒，デフォルトなし间隔。
    + 例子：`POLLING_INTERVAL=5`
12. `BATCH_UPDATE_ENABLED`：有効化数据库批量更新聚合，会导致ユーザー割り当て的更新存在一定的延迟オプション値为 `true` 和 `false`，未設定则デフォルト为 `false`。
    + 例子：`BATCH_UPDATE_ENABLED=true`
    + 如果你遇到了数据库连接数过多的问题，可以尝试有効化该选项。
13. `BATCH_UPDATE_INTERVAL=5`：批量更新聚合的時間间隔，单位为秒，デフォルト为 `5`。
    + 例子：`BATCH_UPDATE_INTERVAL=5`
14. 请求频率限制：
    + `GLOBAL_API_RATE_LIMIT`：全局 API 速率限制（除中继请求外），单 ip 三分钟内的最大请求数，デフォルト为 `180`。
    + `GLOBAL_WEB_RATE_LIMIT`：全局 Web 速率限制，单 ip 三分钟内的最大请求数，デフォルト为 `60`。
15. 编码器缓存設定：
    + `TIKTOKEN_CACHE_DIR`：デフォルト程序启动时会联网下载一些通用的词元的编码，如：`gpt-3.5-turbo`，在一些网络环境不稳定，或者离线情况，可能会导致启动有问题，可以配置此目录缓存数据，可迁移到离线环境。
    + `DATA_GYM_CACHE_DIR`：目前该配置作用与 `TIKTOKEN_CACHE_DIR` 一致，但是优先级没有它高。
16. `RELAY_TIMEOUT`：中继超时設定，单位为秒，デフォルト不設定超时時間。
17. `RELAY_PROXY`：設定后使用该プロキシ来请求 API。
18. `USER_CONTENT_REQUEST_TIMEOUT`：ユーザー上传内容下载超时時間，单位为秒。
19. `USER_CONTENT_REQUEST_PROXY`：設定后使用该プロキシ来请求ユーザー上传的内容，例：图片。
20. `SQLITE_BUSY_TIMEOUT`：SQLite 锁等待超时設定，单位为毫秒，デフォルト `3000`。
21. `GEMINI_SAFETY_SETTING`：Gemini 的安全設定，デフォルト `BLOCK_NONE`。
22. `GEMINI_VERSION`：One API 所使用的 Gemini バージョン，デフォルト为 `v1`。
23. `THEME`：系统的主题設定，デフォルト为 `default`，具体オプション値参考[此处](./web/README.md)。
24. `ENABLE_METRIC`：是否根据请求成功率無効化チャネル，デフォルト不开启，オプション値为 `true` 和 `false`。
25. `METRIC_QUEUE_SIZE`：请求成功率统计队列大小，デフォルト为 `10`。
26. `METRIC_SUCCESS_RATE_THRESHOLD`：请求成功率阈值，デフォルト为 `0.8`。
27. `INITIAL_ROOT_TOKEN`：如果設定了该值，则在系统首次启动时会自动创建一个值为该环境变量值的 root ユーザーAPIキー。
28. `INITIAL_ROOT_ACCESS_TOKEN`：如果設定了该值，则在系统首次启动时会自动创建一个值为该环境变量的 root ユーザー创建系统管理APIキー。
29. `ENFORCE_INCLUDE_USAGE`：是否强制在 stream モデル下返回 usage，デフォルト不开启，オプション値为 `true` 和 `false`。

### 命令行参数
1. `--port <port_number>`: 指定服务器监听的端口号，デフォルト为 `3000`。
   + 例子：`--port 3000`
2. `--log-dir <log_dir>`: 指定ログ文件夹，如果没有設定，デフォルト保存至工作目录的 `logs` 文件夹下。
   + 例子：`--log-dir ./logs`
3. `--version`: 打印系统バージョン号并退出。
4. `--help`: 查看命令的使用帮助和参数说明。

## 演示
### 在线演示
注意：该演示站不提供对外服务：
https://openai.justsong.cn

### 截图展示
![channel](https://user-images.githubusercontent.com/39998050/233837954-ae6683aa-5c4f-429f-a949-6645a83c9490.png)
![token](https://user-images.githubusercontent.com/39998050/233837971-dab488b7-6d96-43af-b640-a168e8d1c9bf.png)

## 常见问题
1. 割り当て是什么？怎么计算的？One API 的割り当て计算有问题？
   + 割り当て = グループレート * モデルレート * （プロンプト token 数 + 補完 token 数 * 補完倍率）
   + 其中補完倍率对于 GPT3.5 固定为 1.33，GPT4 为 2，与官方保持一致。
   + 如果是非流模式，官方接口会返回消耗的总 token，但是你要注意プロンプト和補完的消耗倍率不一样。
   + 注意：One API 的デフォルト倍率就是官方倍率，是已经调整过的。
2. 账户割り当て足够为什么プロンプト割り当て不足？
   + 请检查你的APIキー割り当て是否足够，这个和账户割り当て是分开的。
   + APIキー割り当て仅供ユーザー設定最大使用量，ユーザー可自由設定。
3. プロンプト使用可能なチャネルがありません？
   + 请检查的ユーザーグループ和チャネルグループ設定。
   + 以及チャネル的モデル設定。
4. チャネルテスト报错：`invalid character '<' looking for beginning of value`
   + 这是因为返回值不是合法的 JSON，而是一个 HTML 页面。
   + 大概率是你的部署站的 IP 或プロキシ的节点被 CloudFlare 封禁了。
5. ChatGPT Next Web 报错：`Failed to fetch`
   + 部署的时候不要設定 `BASE_URL`。
   + 检查你的接口地址和 API Key 有没有填对。
   + 检查是否有効化了 HTTPS，浏览器会拦截 HTTPS 域名下的 HTTP 请求。
6. 报错：`当前グループ负载已饱和，请稍后再试`
   + 上游チャネル 429 了。
7. 升级之后我的数据会丢失吗？
   + 如果使用 MySQL，不会。
   + 如果使用 SQLite，需要按照我所给的部署命令挂载 volume 持久化 one-api.db 数据库文件，否则容器重启后数据会丢失。
8. 升级之前数据库需要做变更吗？
   + 一般情况下不需要，系统将在初始化的时候自动调整。
   + 如果需要的话，我会在更新ログ中说明，并给出脚本。
9. 手动修改数据库后报错：`データベースの整合性が破損しています。管理者にお問い合わせください`？
   + 这是检测到 ability 表里有些记录的チャネル id 是不存在的，这大概率是因为你删了 channel 表里的记录但是没有同步在 ability 表里清理なし效的チャネル。
   + 对于每一个チャネル，其所支持的モデル都需要有一个专门的 ability 表的记录，表示该チャネル支持该モデル。

## 相关项目
* [FastGPT](https://github.com/labring/FastGPT): 基于 LLM 大语言モデル的知识库问答系统
* [ChatGPT Next Web](https://github.com/Yidadaa/ChatGPT-Next-Web):  一键拥有你自己的跨平台 ChatGPT 应用
* [VChart](https://github.com/VisActor/VChart):  不只是开箱即用的多端图表库，更是生动灵活的数据故事讲述者。
* [VMind](https://github.com/VisActor/VMind):  不仅自动，还很智能。开源智能可视化解决方案。

## 注意

本项目使用 MITライセンス进行开源，**在此基础上**，必须在页面底部保留署名以及指向本项目的链接。如果不想保留署名，必须首先获得授权。

同样适用于基于本项目的二开项目。

依据 MITライセンス，使用者需自行承担使用本项目的风险与责任，本开源项目开发者与此なし关。
