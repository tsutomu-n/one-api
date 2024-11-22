import { TableCell, TableHead, TableRow } from '@mui/material';

const RedemptionTableHead = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>ID</TableCell>
        <TableCell>名前</TableCell>
        <TableCell>状態</TableCell>
        <TableCell>割り当て</TableCell>
        <TableCell>作成時間</TableCell>
        <TableCell>交換時間</TableCell>
        <TableCell>操作</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default RedemptionTableHead;
