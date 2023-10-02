import React from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { NoDataMessage, ErrorMessage } from "../../../ui/informative";
import { useBasicUserColumn } from "../../../columns";
import { TanstackTable } from "../../../ui/table";

const AssignedUserListDisplay = ({ error, data, loading }) => {
  const columns = useBasicUserColumn();
  return (
    <Box>
      {error ? (
        <ErrorMessage />
      ) : data && data?.assignedUsers.length === 0 ? (
        <NoDataMessage />
      ) : (
        <TanstackTable
          data={data?.assignedUsers}
          columns={columns}
          isLoading={loading}
          pageCount={loading && data?.assignedUsers.length}
        />
      )}
    </Box>
  );
};

export default AssignedUserListDisplay;

AssignedUserListDisplay.propTypes = {
  error: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  data: PropTypes.object,
};
