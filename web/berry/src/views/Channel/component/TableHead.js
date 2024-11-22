import { TableCell, TableHead, TableRow } from '@mui/material';

const ChannelTableHead = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>ID</TableCell>
        <TableCell>名前</TableCell>
        <TableCell>グループ</TableCell>
        <TableCell>タイプ</TableCell>
        <TableCell>状態</TableCell>
        <TableCell>応答時間</TableCell>
        <TableCell>已消耗</TableCell>
        <TableCell>残高</TableCell>
        <TableCell>优先级</TableCell>
        <TableCell>操作</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default ChannelTableHead;
