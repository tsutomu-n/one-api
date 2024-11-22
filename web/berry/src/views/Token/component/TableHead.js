import { TableCell, TableHead, TableRow } from '@mui/material';

const TokenTableHead = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>名前</TableCell>
        <TableCell>状態</TableCell>
        <TableCell>使用済み割り当て</TableCell>
        <TableCell>残り割り当て</TableCell>
        <TableCell>作成時間</TableCell>
        <TableCell>有効期限</TableCell>
        <TableCell>操作</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default TokenTableHead;
