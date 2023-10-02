import React, { useState } from "react";
import { useQuery } from "react-query";
import { Button, Stack, Box } from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined";
import constant from "../../../../../constant";
import { NoDataMessage, ErrorMessage } from "../../../ui/informative";
import { useArchivedUserColumn } from "../../../columns";
import { CostumBSOutlinedInput } from "../../../ui/input/costum-input";
import { TanstackTable } from "../../../ui/table";
import { BSModal } from "../../../ui/content";
import ExcelMangmentDownloader from "./ExcelMangmentDownloader";
import api from "../../../../utils/api";

const { httpsEndpoint } = constant;

const UserArchiveList = () => {
  // state to open close modal
  const [open, setOpen] = useState(false);

  // State for the search input
  const [searchValue, setSearchValue] = useState("");

  // State for query parameters
  const [fetchDataOptions, setFetchDataOptions] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  // Function to fetch user data from the API
  const fetchUsers = async () => {
    const response = await api.get(`${httpsEndpoint}/users`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("id-token")}`,
      },
      params: {
        archived: true,
        page: fetchDataOptions.pageIndex + 1,
        pageSize: fetchDataOptions.pageSize,
        searchQuery: searchValue,
      },
    });
    return response.data;
  };

  // UseQuery hook to manage data fetching
  const { isLoading, data, isError, refetch } = useQuery(
    // Query key, including query parameters
    ["get-users", fetchDataOptions],
    () => fetchUsers(),
    {
      enabled: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  );

  // Custom columns for the table
  const columns = useArchivedUserColumn();

  // Function to handle refreshing the data
  const handleRefresh = () => {
    // Reset the query parameters and searchValue
    setFetchDataOptions({
      pageIndex: 1,
      pageSize: 10,
    });
    setSearchValue("");
    refetch();
  };

  return (
    <>
      {/* Header Section */}
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ marginTop: 1 }}
      >
        {/* Export to Excel Button */}
        <Stack direction="row" gap={1}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FileDownloadOutlinedIcon />}
            onClick={() => setOpen(true)}
          >
            Excel
          </Button>
          {/* Refresh Button */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<CachedOutlinedIcon />}
            onClick={handleRefresh}
            disabled={isLoading}
          >
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
        </Stack>
        {/* Search Input and Search Button */}
        <Stack direction="row" gap={1}>
          <CostumBSOutlinedInput
            placeholder="Recherche...."
            value={searchValue}
            onChange={event => setSearchValue(event.target.value)}
          />
          <Button type="button" variant="contained" onClick={() => refetch()}>
            Recherche
          </Button>
        </Stack>
      </Stack>
      {/* Data Section */}
      <Box>
        {isError ? (
          <ErrorMessage />
        ) : data && data?.users.length === 0 ? (
          <NoDataMessage />
        ) : (
          <TanstackTable
            data={data?.users}
            columns={columns}
            isLoading={isLoading}
            pageCount={data?.totalCount}
            manualPagination={true}
            setFetchDataOptions={setFetchDataOptions}
          />
        )}
      </Box>
      <BSModal open={open} setOpen={setOpen}>
        <ExcelMangmentDownloader open={open} setOpen={setOpen} />
      </BSModal>
    </>
  );
};

export default UserArchiveList;
