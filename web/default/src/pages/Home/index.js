import React, { useContext, useEffect, useState } from 'react';
import { Card, Grid, Header, Segment } from 'semantic-ui-react';
import { API, showError, showNotice, timestamp2string } from '../../helpers';
import { StatusContext } from '../../context/Status';
import { marked } from 'marked';

const Home = () => {
  const [statusState, statusDispatch] = useContext(StatusContext);
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
    return timestamp2string(timestamp);
  };

  useEffect(() => {
    displayNotice().then();
    displayHomePageContent().then();
  }, []);
  return (
    <>
      {
        homePageContentLoaded && homePageContent === '' ? <>
          <Segment>
            <Header as='h3'>システムの状態</Header>
            <Grid columns={2} stackable>
              <Grid.Column>
                <Card fluid>
                  <Card.Content>
                    <Card.Header>システム情報</Card.Header>
                    <Card.Meta>システム情報概要</Card.Meta>
                    <Card.Description>
                      <p>名前：{statusState?.status?.system_name}</p>
                      <p>バージョン：{statusState?.status?.version ? statusState?.status?.version : "unknown"}</p>
                      <p>
                        ソースコード：
                        <a
                          href='https://github.com/songquanpeng/one-api'
                          target='_blank'
                        >
                          https://github.com/songquanpeng/one-api
                        </a>
                      </p>
                      <p>起動時間：{getStartTimeString()}</p>
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card fluid>
                  <Card.Content>
                    <Card.Header>システム設定</Card.Header>
                    <Card.Meta>システム設定概要</Card.Meta>
                    <Card.Description>
                      <p>
                        メール認証：
                        {statusState?.status?.email_verification === true
                          ? '有効済み'
                          : '無効'}
                      </p>
                      <p>
                        GitHub認証：
                        {statusState?.status?.github_oauth === true
                          ? '有効済み'
                          : '無効'}
                      </p>
                      <p>
                        WeChat認証：
                        {statusState?.status?.wechat_login === true
                          ? '有効済み'
                          : '無効'}
                      </p>
                      <p>
                        Turnstileユーザー検証：
                        {statusState?.status?.turnstile_check === true
                          ? '有効済み'
                          : '無効'}
                      </p>
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid>
          </Segment>
        </> : <>
          {
            homePageContent.startsWith('https://') ? <iframe
              src={homePageContent}
              style={{ width: '100%', height: '100vh', border: 'none' }}
            /> : <div style={{ fontSize: 'larger' }} dangerouslySetInnerHTML={{ __html: homePageContent }}></div>
          }
        </>
      }

    </>
  );
};

export default Home;
