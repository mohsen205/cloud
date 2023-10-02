import React, { useState } from "react";
import { useQuery } from "react-query";
import { Box, Button, Stack } from "@mui/material";
import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined";
import constant from "../../../../../constant";
import { NoDataMessage, ErrorMessage } from "../../../ui/informative";
import { useAccomplishedShiftColumns } from "../../../columns";
import { CostumBSOutlinedInput } from "../../../ui/input/costum-input";
import { TanstackTable } from "../../../ui/table";
import api from "../../../../utils/api";
import { ArchiveShift } from "../common-ui";

const { httpsEndpoint } = constant;

const AccomplishedShiftTable = () => {
  const [isArchiveShiftModalOpen, setIsArchiveShiftModalOpen] = useState(false);
  const [archivedShiftId, setArchivedShiftId] = useState("");

  const [searchValue, setSearchValue] = useState("");

  // State for query parameters
  const [fetchDataOptions, setFetchDataOptions] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const fetchShifts = async () => {
    const response = await api.get(
      `${httpsEndpoint}/shifts?archived=false&status=ended`,
      {
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
      },
    );
    return response.data;
  };

  // UseQuery hook to manage data fetching
  const { isLoading, data, isError, refetch } = useQuery(
    // Query key, including query parameters
    ["get-shifts", fetchDataOptions],
    () => fetchShifts(),
    {
      enabled: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  );

  const handleOpenArchiveModal = id => {
    setArchivedShiftId(id);
    setIsArchiveShiftModalOpen(true);
  };

  // Custom columns for the table
  const columns = useAccomplishedShiftColumns(handleOpenArchiveModal);

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
      <Box>
        {isError ? (
          <ErrorMessage />
        ) : data && data?.shifts.length === 0 ? (
          <NoDataMessage />
        ) : (
          <TanstackTable
            data={data?.shifts}
            columns={columns}
            isLoading={isLoading}
            pageCount={data?.totalCount}
            manualPagination={true}
            setFetchDataOptions={setFetchDataOptions}
          />
        )}
      </Box>
      <ArchiveShift
        refetch={refetch}
        id={archivedShiftId}
        open={isArchiveShiftModalOpen}
        setOpen={setIsArchiveShiftModalOpen}
      />
    </>
  );
};

export default AccomplishedShiftTable;
