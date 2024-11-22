import React from 'react';
import { Segment, Header } from 'semantic-ui-react';
import RedemptionsTable from '../../components/RedemptionsTable';

const Redemption = () => (
  <>
    <Segment>
      <Header as='h3'>交換コードを管理</Header>
      <RedemptionsTable/>
    </Segment>
  </>
);

export default Redemption;
