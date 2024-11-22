import PropTypes from 'prop-types';
import { TableCell, TableHead, TableRow } from '@mui/material';

const LogTableHead = ({ userIsAdmin }) => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>時間</TableCell>
        {userIsAdmin && <TableCell>チャネル</TableCell>}
        {userIsAdmin && <TableCell>ユーザー</TableCell>}
        <TableCell>APIキー</TableCell>
        <TableCell>タイプ</TableCell>
        <TableCell>モデル</TableCell>
        <TableCell>プロンプト</TableCell>
        <TableCell>補完</TableCell>
        <TableCell>割り当て</TableCell>
        <TableCell>詳細</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default LogTableHead;

LogTableHead.propTypes = {
  userIsAdmin: PropTypes.bool
};
