import { TableCell, TableHead, TableRow } from '@mui/material';

const UsersTableHead = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>ID</TableCell>
        <TableCell>ユーザー名</TableCell>
        <TableCell>グループ</TableCell>
        <TableCell>統計情報</TableCell>
        <TableCell>ユーザーロール</TableCell>
        <TableCell>紐付ける</TableCell>
        <TableCell>状態</TableCell>
        <TableCell>操作</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default UsersTableHead;
