import React from 'react';
import { Segment, Header } from 'semantic-ui-react';
import UsersTable from '../../components/UsersTable';

const User = () => (
  <>
    <Segment>
      <Header as='h3'>ユーザーを管理</Header>
      <UsersTable/>
    </Segment>
  </>
);

export default User;
