import React from 'react';
import UsersTable from '../../components/UsersTable';
import {Layout} from "@douyinfe/semi-ui";

const User = () => (
  <>
    <Layout>
        <Layout.Header>
            <h3>ユーザーを管理</h3>
        </Layout.Header>
        <Layout.Content>
            <UsersTable/>
        </Layout.Content>
    </Layout>
  </>
);

export default User;
