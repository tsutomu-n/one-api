import React, { useContext, useEffect, useState } from 'react';
import { Card, Col, Row } from '@douyinfe/semi-ui';
import { API, showError, showNotice, timestamp2string } from '../../helpers';
import { StatusContext } from '../../context/Status';
import { marked } from 'marked';

const Home = () => {
  const [statusState] = useContext(StatusContext);
  const [homePageContentLoaded, setHomePageContentLoaded] = useState(false);
  const [homePageContent, setHomePageContent] = useState('');

  const displayNotice = async () => {
    const res = await API.get('/api/notice');
    const { success, message, data } = res.data;
    if (success) {
      let oldNotice = localStorage.getItem('notice');
      if (data !== oldNotice && data !== '') {
        const htmlNotice = marked(data);
        showNotice(htmlNotice, true);
        localStorage.setItem('notice', data);
      }
    } else {
      showError(message);
    }
  };

  const displayHomePageContent = async () => {
    setHomePageContent(localStorage.getItem('home_page_content') || '');
    const res = await API.get('/api/home_page_content');
    const { success, message, data } = res.data;
    if (success) {
      let content = data;
      if (!data.startsWith('https://')) {
        content = marked.parse(data);
      }
      setHomePageContent(content);
      localStorage.setItem('home_page_content', content);
    } else {
      showError(message);
      setHomePageContent('ホームページコンテンツの読み込みに失敗しました...');
    }
    setHomePageContentLoaded(true);
  };

  const getStartTimeString = () => {
    const timestamp = statusState?.status?.start_time;
    return statusState.status ? timestamp2string(timestamp) : '';
  };

  useEffect(() => {
    displayNotice().then();
    displayHomePageContent().then();
  }, []);
  return (
    <>
      {
        homePageContentLoaded && homePageContent === '' ?
          <>
            <Card
              bordered={false}
              headerLine={false}
              title='システムの状態'
              bodyStyle={{ padding: '10px 20px' }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Card
                    title='システム情報'
                    headerExtraContent={<span
                      style={{ fontSize: '12px', color: 'var(--semi-color-text-1)' }}>システム情報概要</span>}>
                    <p>名前：{statusState?.status?.system_name}</p>
                    <p>バージョン：{statusState?.status?.version ? statusState?.status?.version : 'unknown'}</p>
                    <p>
                      ソースコード：
                      <a
                        href='https://github.com/songquanpeng/one-api'
                        target='_blank' rel='noreferrer'
                      >
                        https://github.com/songquanpeng/one-api
                      </a>
                    </p>
                    <p>起動時間：{getStartTimeString()}</p>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card
                    title='システム設定'
                    headerExtraContent={<span
                      style={{ fontSize: '12px', color: 'var(--semi-color-text-1)' }}>システム設定概要</span>}>
                    <p>
                      メール認証：
                      {statusState?.status?.email_verification === true ? '有効済み' : '無効'}
                    </p>
                    <p>
                      GitHub認証：
                      {statusState?.status?.github_oauth === true ? '有効済み' : '無効'}
                    </p>
                    <p>
                      WeChat認証：
                      {statusState?.status?.wechat_login === true ? '有効済み' : '無効'}
                    </p>
                    <p>
                      Turnstileユーザー検証：
                      {statusState?.status?.turnstile_check === true ? '有効済み' : '無効'}
                    </p>
                    {/*<p>*/}
                    {/*  Telegram 身份验证：*/}
                    {/*  {statusState?.status?.telegram_oauth === true*/}
                    {/*    ? '有効済み' : '無効'}*/}
                    {/*</p>*/}
                  </Card>
                </Col>
              </Row>
            </Card>

          </>
          : <>
            {
              homePageContent.startsWith('https://') ?
                <iframe src={homePageContent} style={{ width: '100%', height: '100vh', border: 'none' }} /> :
                <div style={{ fontSize: 'larger' }} dangerouslySetInnerHTML={{ __html: homePageContent }}></div>
            }
          </>
      }

    </>
  );
};

export default Home;