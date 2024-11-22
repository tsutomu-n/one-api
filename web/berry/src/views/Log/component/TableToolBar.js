import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import {
  IconUser,
  IconKey,
  IconBrandGithubCopilot,
  IconSitemap,
} from "@tabler/icons-react";
import {
  InputAdornment,
  OutlinedInput,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import LogType from "../type/LogType";
require("dayjs/locale/zh-cn");
// ----------------------------------------------------------------------

export default function TableToolBar({
  filterName,
  handleFilterName,
  userIsAdmin,
}) {
  const theme = useTheme();
  const grey500 = theme.palette.grey[500];

  return (
    <>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 3, sm: 2, md: 4 }}
        padding={"24px"}
        paddingBottom={"0px"}
      >
        <FormControl>
          <InputLabel htmlFor="channel-token_name-label">APIキー名</InputLabel>
          <OutlinedInput
            id="token_name"
            name="token_name"
            sx={{
              minWidth: "100%",
            }}
            label="APIキー名"
            value={filterName.token_name}
            onChange={handleFilterName}
            placeholder="APIキー名"
            startAdornment={
              <InputAdornment position="start">
                <IconKey stroke={1.5} size="20px" color={grey500} />
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="channel-model_name-label">モデル名</InputLabel>
          <OutlinedInput
            id="model_name"
            name="model_name"
            sx={{
              minWidth: "100%",
            }}
            label="モデル名"
            value={filterName.model_name}
            onChange={handleFilterName}
            placeholder="モデル名"
            startAdornment={
              <InputAdornment position="start">
                <IconBrandGithubCopilot
                  stroke={1.5}
                  size="20px"
                  color={grey500}
                />
              </InputAdornment>
            }
          />
        </FormControl>

        <FormControl>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale={"zh-cn"}
          >
            <DateTimePicker
              label="開始時間"
              ampm={false}
              name="start_timestamp"
              value={
                filterName.start_timestamp === 0
                  ? null
                  : dayjs.unix(filterName.start_timestamp)
              }
              onChange={(value) => {
                if (value === null) {
                  handleFilterName({
                    target: { name: "start_timestamp", value: 0 },
                  });
                  return;
                }
                handleFilterName({
                  target: { name: "start_timestamp", value: value.unix() },
                });
              }}
              slotProps={{
                actionBar: {
                  actions: ["clear", "today", "accept"],
                },
              }}
            />
          </LocalizationProvider>
        </FormControl>

        <FormControl>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale={"zh-cn"}
          >
            <DateTimePicker
              label="終了時間"
              name="end_timestamp"
              ampm={false}
              value={
                filterName.end_timestamp === 0
                  ? null
                  : dayjs.unix(filterName.end_timestamp)
              }
              onChange={(value) => {
                if (value === null) {
                  handleFilterName({
                    target: { name: "end_timestamp", value: 0 },
                  });
                  return;
                }
                handleFilterName({
                  target: { name: "end_timestamp", value: value.unix() },
                });
              }}
              slotProps={{
                actionBar: {
                  actions: ["clear", "today", "accept"],
                },
              }}
            />
          </LocalizationProvider>
        </FormControl>
      </Stack>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 3, sm: 2, md: 4 }}
        padding={"24px"}
      >
        {userIsAdmin && (
          <FormControl>
            <InputLabel htmlFor="channel-channel-label">チャネルID</InputLabel>
            <OutlinedInput
              id="channel"
              name="channel"
              sx={{
                minWidth: "100%",
              }}
              label="チャネルID"
              value={filterName.channel}
              onChange={handleFilterName}
              placeholder="チャネルID"
              startAdornment={
                <InputAdornment position="start">
                  <IconSitemap stroke={1.5} size="20px" color={grey500} />
                </InputAdornment>
              }
            />
          </FormControl>
        )}

        {userIsAdmin && (
          <FormControl>
            <InputLabel htmlFor="channel-username-label">ユーザー名</InputLabel>
            <OutlinedInput
              id="username"
              name="username"
              sx={{
                minWidth: "100%",
              }}
              label="ユーザー名"
              value={filterName.username}
              onChange={handleFilterName}
              placeholder="ユーザー名"
              startAdornment={
                <InputAdornment position="start">
                  <IconUser stroke={1.5} size="20px" color={grey500} />
                </InputAdornment>
              }
            />
          </FormControl>
        )}

        <FormControl sx={{ minWidth: "22%" }}>
          <InputLabel htmlFor="channel-type-label">タイプ</InputLabel>
          <Select
            id="channel-type-label"
            label="タイプ"
            value={filterName.type}
            name="type"
            onChange={handleFilterName}
            sx={{
              minWidth: "100%",
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200,
                },
              },
            }}
          >
            {Object.values(LogType).map((option) => {
              return (
                <MenuItem key={option.value} value={option.value}>
                  {option.text}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Stack>
    </>
  );
}

TableToolBar.propTypes = {
  filterName: PropTypes.object,
  handleFilterName: PropTypes.func,
  userIsAdmin: PropTypes.bool,
};
