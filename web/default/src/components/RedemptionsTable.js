import React, { useEffect, useState } from 'react';
import { Button, Form, Label, Popup, Pagination, Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { API, copy, showError, showInfo, showSuccess, showWarning, timestamp2string } from '../helpers';

import { ITEMS_PER_PAGE } from '../constants';
import { renderQuota } from '../helpers/render';

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
      return <Label basic color='green'>未使用</Label>;
    case 2:
      return <Label basic color='red'> 無効済み </Label>;
    case 3:
      return <Label basic color='grey'> 使用済み </Label>;
    default:
      return <Label basic color='black'> 不明な状態 </Label>;
  }
}

const RedemptionsTable = () => {
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searching, setSearching] = useState(false);

  const loadRedemptions = async (startIdx) => {
    const res = await API.get(`/api/redemption/?p=${startIdx}`);
    const { success, message, data } = res.data;
    if (success) {
      if (startIdx === 0) {
        setRedemptions(data);
      } else {
        let newRedemptions = redemptions;
        newRedemptions.push(...data);
        setRedemptions(newRedemptions);
      }
    } else {
      showError(message);
    }
    setLoading(false);
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

  const manageRedemption = async (id, action, idx) => {
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
      let realIdx = (activePage - 1) * ITEMS_PER_PAGE + idx;
      if (action === 'delete') {
        newRedemptions[realIdx].deleted = true;
      } else {
        newRedemptions[realIdx].status = redemption.status;
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

  const handleKeywordChange = async (e, { value }) => {
    setSearchKeyword(value.trim());
  };

  const sortRedemption = (key) => {
    if (redemptions.length === 0) return;
    setLoading(true);
    let sortedRedemptions = [...redemptions];
    sortedRedemptions.sort((a, b) => {
      if (!isNaN(a[key])) {
        // If the value is numeric, subtract to sort
        return a[key] - b[key];
      } else {
        // If the value is not numeric, sort as strings
        return ('' + a[key]).localeCompare(b[key]);
      }
    });
    if (sortedRedemptions[0].id === redemptions[0].id) {
      sortedRedemptions.reverse();
    }
    setRedemptions(sortedRedemptions);
    setLoading(false);
  };

  return (
    <>
      <Form onSubmit={searchRedemptions}>
        <Form.Input
          icon='search'
          fluid
          iconPosition='left'
          placeholder='交換コードのIDと名前を検索 ...'
          value={searchKeyword}
          loading={searching}
          onChange={handleKeywordChange}
        />
      </Form>

      <Table basic compact size='small'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortRedemption('id');
              }}
            >
              ID
            </Table.HeaderCell>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortRedemption('name');
              }}
            >
              名前
            </Table.HeaderCell>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortRedemption('status');
              }}
            >
              状態
            </Table.HeaderCell>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortRedemption('quota');
              }}
            >
              割り当て
            </Table.HeaderCell>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortRedemption('created_time');
              }}
            >
              作成時間
            </Table.HeaderCell>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortRedemption('redeemed_time');
              }}
            >
              交換時間
            </Table.HeaderCell>
            <Table.HeaderCell>操作</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {redemptions
            .slice(
              (activePage - 1) * ITEMS_PER_PAGE,
              activePage * ITEMS_PER_PAGE
            )
            .map((redemption, idx) => {
              if (redemption.deleted) return <></>;
              return (
                <Table.Row key={redemption.id}>
                  <Table.Cell>{redemption.id}</Table.Cell>
                  <Table.Cell>{redemption.name ? redemption.name : 'なし'}</Table.Cell>
                  <Table.Cell>{renderStatus(redemption.status)}</Table.Cell>
                  <Table.Cell>{renderQuota(redemption.quota)}</Table.Cell>
                  <Table.Cell>{renderTimestamp(redemption.created_time)}</Table.Cell>
                  <Table.Cell>{redemption.redeemed_time ? renderTimestamp(redemption.redeemed_time) : "未交換"} </Table.Cell>
                  <Table.Cell>
                    <div>
                      <Button
                        size={'small'}
                        positive
                        onClick={async () => {
                          if (await copy(redemption.key)) {
                            showSuccess('クリップボードにコピーしました！');
                          } else {
                            showWarning('クリップボードにコピーできません，手動でコピーしてください，交換コードを検索ボックスに入力しました。')
                            setSearchKeyword(redemption.key);
                          }
                        }}
                      >
                        コピー
                      </Button>
                      <Popup
                        trigger={
                          <Button size='small' negative>
                            削除
                          </Button>
                        }
                        on='click'
                        flowing
                        hoverable
                      >
                        <Button
                          negative
                          onClick={() => {
                            manageRedemption(redemption.id, 'delete', idx);
                          }}
                        >
                          削除の確認
                        </Button>
                      </Popup>
                      <Button
                        size={'small'}
                        disabled={redemption.status === 3}  // used
                        onClick={() => {
                          manageRedemption(
                            redemption.id,
                            redemption.status === 1 ? 'disable' : 'enable',
                            idx
                          );
                        }}
                      >
                        {redemption.status === 1 ? '無効化' : '有効化'}
                      </Button>
                      <Button
                        size={'small'}
                        as={Link}
                        to={'/redemption/edit/' + redemption.id}
                      >
                        編集
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            })}
        </Table.Body>

        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan='8'>
              <Button size='small' as={Link} to='/redemption/add' loading={loading}>
                新しい交換コードを追加
              </Button>
              <Pagination
                floated='right'
                activePage={activePage}
                onPageChange={onPaginationChange}
                size='small'
                siblingRange={1}
                totalPages={
                  Math.ceil(redemptions.length / ITEMS_PER_PAGE) +
                  (redemptions.length % ITEMS_PER_PAGE === 0 ? 1 : 0)
                }
              />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </>
  );
};

export default RedemptionsTable;
