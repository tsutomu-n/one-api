import React from 'react';
import SystemSetting from '../../components/SystemSetting';
import {isRoot} from '../../helpers';
import OtherSetting from '../../components/OtherSetting';
import PersonalSetting from '../../components/PersonalSetting';
import OperationSetting from '../../components/OperationSetting';
import {Layout, TabPane, Tabs} from "@douyinfe/semi-ui";

const Setting = () => {
    let panes = [
        {
            tab: '個人設定',
            content: <PersonalSetting/>,
            itemKey: '1'
        }
    ];

    if (isRoot()) {
        panes.push({
            tab: '運用設定',
            content: <OperationSetting/>,
            itemKey: '2'
        });
        panes.push({
            tab: 'システム設定',
            content: <SystemSetting/>,
            itemKey: '3'
        });
        panes.push({
            tab: 'その他の設定',
            content: <OtherSetting/>,
            itemKey: '4'
        });
    }

    return (
        <div>
            <Layout>
                <Layout.Content>
                    <Tabs type="line" defaultActiveKey="1">
                        {panes.map(pane => (
                            <TabPane itemKey={pane.itemKey} tab={pane.tab}>
                                {pane.content}
                            </TabPane>
                        ))}
                    </Tabs>
                </Layout.Content>
            </Layout>
        </div>
    );
};

export default Setting;
