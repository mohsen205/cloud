import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Container } from "@mui/material";
import { useOngoingShiftColumns } from "../../../columns";
import { ErrorMessage, NoDataMessage } from "../../../ui/informative";
import { TanstackTable } from "../../../ui/table";
import useWebSocket from "../../../../utils/Hooks/useWebSocket";
import constant from "../../../../../constant";
import MarkShiftAsEnded from "./MarkShiftAsEnded";

const { websocketEndpoint } = constant;

const OngoingShiftTable = ({ searchValue, sortBy }) => {
  const [isMarkShiftAsEndedModalOpen, setIsMarkShiftAsEndedModalOpen] =
    useState(false);
  const [markedShiftAsEndedId, setMarkedShiftAsEndedId] = useState("");

  const [fetchDataOptions, setFetchDataOptions] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const { loading, data, error, sendData } = useWebSocket(
    `${websocketEndpoint}?method=GET_SHIFTS_DATA&status=in-progress`,
  );

  const handleMarkShiftAsEndedModalOpen = id => {
    setIsMarkShiftAsEndedModalOpen(true);
    setMarkedShiftAsEndedId(id);
  };

  const columns = useOngoingShiftColumns(handleMarkShiftAsEndedModalOpen);

  useEffect(() => {
    if (searchValue !== "") {
      sendData({
        searchQuery: {
          globalSearch: searchValue,
        },
      });
    }
    if (sortBy.field !== "" && sortBy.order !== 0) {
      sendData({
        sortBy: sortBy,
      });
    }
  }, [searchValue, sortBy]);

  useEffect(() => {
    sendData({
      page: fetchDataOptions.pageIndex + 1,
    });
  }, [fetchDataOptions.pageIndex]);

  useEffect(() => {
    sendData({
      pageSize: fetchDataOptions.pageSize + 1,
    });
  }, [fetchDataOptions.pageSize]);

  return (
    <>
      <Container>
        {error || data?.error ? (
          <ErrorMessage />
        ) : data && data?.shifts.length === 0 ? (
          <NoDataMessage />
        ) : (
          <TanstackTable
            data={data?.shifts}
            columns={columns}
            isLoading={loading}
            pageCount={data?.totalCount}
            manualPagination={true}
            setFetchDataOptions={setFetchDataOptions}
          />
        )}
      </Container>
      <MarkShiftAsEnded
        id={markedShiftAsEndedId}
        open={isMarkShiftAsEndedModalOpen}
        setOpen={setIsMarkShiftAsEndedModalOpen}
      />
    </>
  );
};

export default OngoingShiftTable;

OngoingShiftTable.propTypes = {
  searchValue: PropTypes.string,
  sortBy: PropTypes.object,
};
