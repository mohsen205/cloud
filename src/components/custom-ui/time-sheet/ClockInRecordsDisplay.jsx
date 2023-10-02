import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Box, Stack, Typography } from "@mui/material";
import { useQuery } from "react-query";
import { ErrorMessage, NoDataMessage } from "../../ui/informative";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { TanstackTable } from "../../ui/table";
import api from "../../../utils/api";
import constant from "../../../../constant";
import { useClockInRecordsColumns } from "../../columns/time-sheet";

const ClockInRecordsDisplay = ({ selectedUserDetails }) => {
  // State for query parameters
  const [fetchDataOptions, setFetchDataOptions] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const fetchClockInRecords = async () => {
    const response = await api.get(
      `${constant.httpsEndpoint}/clock-in-record/${selectedUserDetails?.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("id-token")}`,
        },
        params: {
          page: fetchDataOptions.pageIndex + 1,
          pageSize: fetchDataOptions.pageSize,
        },
      },
    );
    return response.data;
  };

  const columns = useClockInRecordsColumns();

  // UseQuery hook to manage data fetching
  const { isLoading, data, isError, refetch } = useQuery(
    // Query key, including query parameters
    ["get-clockInRocreds", fetchDataOptions],
    () => fetchClockInRecords(),
    {
      enabled: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    if (selectedUserDetails.id) {
      refetch();
    }
  }, [selectedUserDetails.id]);

  if (!selectedUserDetails.id)
    return (
      <Stack
        direction="row"
        alignContent="center"
        style={{ marginTop: 5 }}
        gap={1}
      >
        <HelpOutlineOutlinedIcon />
        <Typography variant="body1">
          Veuillez sélectionner un utilisateur
        </Typography>
      </Stack>
    );

  return (
    <Box>
      {isError ? (
        <ErrorMessage />
      ) : data && data?.clockInRecords.length === 0 ? (
        <NoDataMessage />
      ) : (
        <TanstackTable
          data={data?.clockInRecords}
          columns={columns}
          isLoading={isLoading}
          pageCount={data?.totalCount}
          manualPagination={true}
          setFetchDataOptions={setFetchDataOptions}
        />
      )}
    </Box>
  );
};

export default ClockInRecordsDisplay;

ClockInRecordsDisplay.propTypes = {
  selectedUserDetails: PropTypes.object.isRequired,
};
