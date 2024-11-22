import React, { useEffect, useState } from 'react';
import { API, copy, showError, showSuccess, timestamp2string } from '../helpers';

import { ITEMS_PER_PAGE } from '../constants';
import { renderQuota } from '../helpers/render';
import { Button, Form, Modal, Popconfirm, Popover, Table, Tag } from '@douyinfe/semi-ui';
import EditRedemption from '../pages/Redemption/EditRedemption';

function renderTimestamp(timestamp) {
  return (
    <>
      {timestamp2string(timestamp)}
    </>
  );
}

function renderStatus(status) {
  switch (status) {
    case 1:
      return <Tag color="green" size="large">未使用</Tag>;
    case 2:
      return <Tag color="red" size="large"> 無効済み </Tag>;
    case 3:
      return <Tag color="grey" size="large"> 使用済み </Tag>;
    default:
      return <Tag color="black" size="large"> 不明な状態 </Tag>;
  }
}

const RedemptionsTable = () => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id'
    },
    {
      title: '名前',
      dataIndex: 'name'
    },
    {
      title: '状態',
      dataIndex: 'status',
      key: 'status',
      render: (text, record, index) => {
        return (
          <div>
            {renderStatus(text)}
          </div>
        );
      }
    },
    {
      title: '割り当て',
      dataIndex: 'quota',
      render: (text, record, index) => {
        return (
          <div>
            {renderQuota(parseInt(text))}
          </div>
        );
      }
    },
    {
      title: '作成時間',
      dataIndex: 'created_time',
      render: (text, record, index) => {
        return (
          <div>
            {renderTimestamp(text)}
          </div>
        );
      }
    },
    // {
    //   title: '交換人ID',
    //   dataIndex: 'used_user_id',
    //   render: (text, record, index) => {
    //     return (
    //       <div>
    //         {text === 0 ? 'なし' : text}
    //       </div>
    //     );
    //   }
    // },
    {
      title: '',
      dataIndex: 'operate',
      render: (text, record, index) => (
        <div>
          <Popover
            content={
              record.key
            }
            style={{ padding: 20 }}
            position="top"
          >
            <Button theme="light" type="tertiary" style={{ marginRight: 1 }}>查看</Button>
          </Popover>
          <Button theme="light" type="secondary" style={{ marginRight: 1 }}
                  onClick={async (text) => {
                    await copyText(record.key);
                  }}
          >コピー</Button>
          <Popconfirm
            title="确定是否要削除此交換コード？"
            content="此修改将不可逆"
            okType={'danger'}
            position={'left'}
            onConfirm={() => {
              manageRedemption(record.id, 'delete', record).then(
                () => {
                  removeRecord(record.key);
                }
              );
            }}
          >
            <Button theme="light" type="danger" style={{ marginRight: 1 }}>削除</Button>
          </Popconfirm>
          {
            record.status === 1 ?
              <Button theme="light" type="warning" style={{ marginRight: 1 }} onClick={
                async () => {
                  manageRedemption(
                    record.id,
                    'disable',
                    record
                  );
                }
              }>無効化</Button> :
              <Button theme="light" type="secondary" style={{ marginRight: 1 }} onClick={
                async () => {
                  manageRedemption(
                    record.id,
                    'enable',
                    record
                  );
                }
              } disabled={record.status === 3}>有効化</Button>
          }
          <Button theme="light" type="tertiary" style={{ marginRight: 1 }} onClick={
            () => {
              setEditingRedemption(record);
              setShowEdit(true);
            }
          } disabled={record.status !== 1}>編集</Button>
        </div>
      )
    }
  ];

  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searching, setSearching] = useState(false);
  const [tokenCount, setTokenCount] = useState(ITEMS_PER_PAGE);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [editingRedemption, setEditingRedemption] = useState({
    id: undefined
  });
  const [showEdit, setShowEdit] = useState(false);

  const closeEdit = () => {
    setShowEdit(false);
  };

  // const setCount = (data) => {
  //     if (data.length >= (activePage) * ITEMS_PER_PAGE) {
  //         setTokenCount(data.length + 1);
  //     } else {
  //         setTokenCount(data.length);
  //     }
  // }

  const setRedemptionFormat = (redeptions) => {
    // for (let i = 0; i < redeptions.length; i++) {
    //     redeptions[i].key = '' + redeptions[i].id;
    // }
    // data.key = '' + data.id
    setRedemptions(redeptions);
    if (redeptions.length >= (activePage) * ITEMS_PER_PAGE) {
      setTokenCount(redeptions.length + 1);
    } else {
      setTokenCount(redeptions.length);
    }
  };

  const loadRedemptions = async (startIdx) => {
    const res = await API.get(`/api/redemption/?p=${startIdx}`);
    const { success, message, data } = res.data;
    if (success) {
      if (startIdx === 0) {
        setRedemptionFormat(data);
      } else {
        let newRedemptions = redemptions;
        newRedemptions.push(...data);
        setRedemptionFormat(newRedemptions);
      }
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const removeRecord = key => {
    let newDataSource = [...redemptions];
    if (key != null) {
      let idx = newDataSource.findIndex(data => data.key === key);

      if (idx > -1) {
        newDataSource.splice(idx, 1);
        setRedemptions(newDataSource);
      }
    }
  };

  const copyText = async (text) => {
    if (await copy(text)) {
      showSuccess('クリップボードにコピーしました！');
    } else {
      // setSearchKeyword(text);
      Modal.error({ title: 'クリップボードにコピーできません，手動でコピーしてください', content: text });
    }
  };

  const onPaginationChange = (e, { activePage }) => {
    (async () => {
      if (activePage === Math.ceil(redemptions.length / ITEMS_PER_PAGE) + 1) {
        // In this case we have to load more data and then append them.
        await loadRedemptions(activePage - 1);
      }
      setActivePage(activePage);
    })();
  };

  useEffect(() => {
    loadRedemptions(0)
      .then()
      .catch((reason) => {
        showError(reason);
      });
  }, []);

  const refresh = async () => {
    await loadRedemptions(activePage - 1);
  };

  const manageRedemption = async (id, action, record) => {
    let data = { id };
    let res;
    switch (action) {
      case 'delete':
        res = await API.delete(`/api/redemption/${id}/`);
        break;
      case 'enable':
        data.status = 1;
        res = await API.put('/api/redemption/?status_only=true', data);
        break;
      case 'disable':
        data.status = 2;
        res = await API.put('/api/redemption/?status_only=true', data);
        break;
    }
    const { success, message } = res.data;
    if (success) {
      showSuccess('操作が正常に完了しました！');
      let redemption = res.data.data;
      let newRedemptions = [...redemptions];
      // let realIdx = (activePage - 1) * ITEMS_PER_PAGE + idx;
      if (action === 'delete') {

      } else {
        record.status = redemption.status;
      }
      setRedemptions(newRedemptions);
    } else {
      showError(message);
    }
  };

  const searchRedemptions = async () => {
    if (searchKeyword === '') {
      // if keyword is blank, load files instead.
      await loadRedemptions(0);
      setActivePage(1);
      return;
    }
    setSearching(true);
    const res = await API.get(`/api/redemption/search?keyword=${searchKeyword}`);
    const { success, message, data } = res.data;
    if (success) {
      setRedemptions(data);
      setActivePage(1);
    } else {
      showError(message);
    }
    setSearching(false);
  };

  const handleKeywordChange = async (value) => {
    setSearchKeyword(value.trim());
  };

  const sortRedemption = (key) => {
    if (redemptions.length === 0) return;
    setLoading(true);
    let sortedRedemptions = [...redemptions];
    sortedRedemptions.sort((a, b) => {
      return ('' + a[key]).localeCompare(b[key]);
    });
    if (sortedRedemptions[0].id === redemptions[0].id) {
      sortedRedemptions.reverse();
    }
    setRedemptions(sortedRedemptions);
    setLoading(false);
  };

  const handlePageChange = page => {
    setActivePage(page);
    if (page === Math.ceil(redemptions.length / ITEMS_PER_PAGE) + 1) {
      // In this case we have to load more data and then append them.
      loadRedemptions(page - 1).then(r => {
      });
    }
  };

  let pageData = redemptions.slice((activePage - 1) * ITEMS_PER_PAGE, activePage * ITEMS_PER_PAGE);
  const rowSelection = {
    onSelect: (record, selected) => {
    },
    onSelectAll: (selected, selectedRows) => {
    },
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedKeys(selectedRows);
    }
  };

  const handleRow = (record, index) => {
    if (record.status !== 1) {
      return {
        style: {
          background: 'var(--semi-color-disabled-border)'
        }
      };
    } else {
      return {};
    }
  };

  return (
    <>
      <EditRedemption refresh={refresh} editingRedemption={editingRedemption} visiable={showEdit}
                      handleClose={closeEdit}></EditRedemption>
      <Form onSubmit={searchRedemptions}>
        <Form.Input
          label="搜索关键字"
          field="keyword"
          icon="search"
          iconPosition="left"
          placeholder="关键字(id或者名前)"
          value={searchKeyword}
          loading={searching}
          onChange={handleKeywordChange}
        />
      </Form>

      <Table style={{ marginTop: 20 }} columns={columns} dataSource={pageData} pagination={{
        currentPage: activePage,
        pageSize: ITEMS_PER_PAGE,
        total: tokenCount,
        // showSizeChanger: true,
        // pageSizeOptions: [10, 20, 50, 100],
        formatPageText: (page) => `第 ${page.currentStart} - ${page.currentEnd} 条，共 ${redemptions.length} 条`,
        // onPageSizeChange: (size) => {
        //   setPageSize(size);
        //   setActivePage(1);
        // },
        onPageChange: handlePageChange
      }} loading={loading} rowSelection={rowSelection} onRow={handleRow}>
      </Table>
      <Button theme="light" type="primary" style={{ marginRight: 8 }} onClick={
        () => {
          setEditingRedemption({
            id: undefined
          });
          setShowEdit(true);
        }
      }>添加交換コード</Button>
      <Button label="コピー所选交換コード" type="warning" onClick={
        async () => {
          if (selectedKeys.length === 0) {
            showError('请至少选择一个交換コード！');
            return;
          }
          let keys = '';
          for (let i = 0; i < selectedKeys.length; i++) {
            keys += selectedKeys[i].name + '    ' + selectedKeys[i].key + '\n';
          }
          await copyText(keys);
        }
      }>コピー所选交換コード到剪贴板</Button>
    </>
  );
};

export default RedemptionsTable;
