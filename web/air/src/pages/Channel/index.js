import React from 'react';
import ChannelsTable from '../../components/ChannelsTable';
import {Layout} from "@douyinfe/semi-ui";

const File = () => (
    <>
        <Layout>
            <Layout.Header>
                <h3>チャネルを管理</h3>
            </Layout.Header>
            <Layout.Content>
                <ChannelsTable/>
            </Layout.Content>
        </Layout>
    </>
);

export default File;
