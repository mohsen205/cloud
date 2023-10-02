import React, { useMemo } from "react";
import { Typography } from "@mui/material";
import { formatDateTime, formatToISODate } from "../../../utils/times";

const useClockInRecordsColumns = handleOpenArchiveModal => {
  return useMemo(
    () => [
      {
        id: "shiftNumber",
        header: "N°",
        accessorFn: row => row.shiftId.shiftNumber,
        cell: info => (
          <Typography variant="body1" color="initial">
            {info.getValue()}
          </Typography>
        ),
      },
      {
        id: "clientName",
        header: "Nom du client",
        accessorFn: row => row.shiftId.client.clientName,
        cell: info => (
          <Typography variant="body1" color="initial">
            {info.getValue()}
          </Typography>
        ),
      },
      {
        id: "date",
        header: "Date",
        accessorFn: row => row.shiftId.date,
        cell: info => (
          <Typography variant="body1" color="initial">
            {formatToISODate(info.getValue())}
          </Typography>
        ),
      },
      {
        id: "shiftTime",
        header: "Déb. - Fin",
        accessorFn: row => `${row.shiftId.startTime} - ${row.shiftId.endTime}`,
        cell: info => (
          <Typography variant="body1" color="initial">
            {info.getValue()}
          </Typography>
        ),
      },
      {
        id: "functionName",
        header: "Poste demandé",
        accessorFn: row => row.shiftId.requestedPosition.functionName,
        cell: info => (
          <Typography variant="body1" sx={{ minWidth: 115 }} color="initial">
            {info.getValue()}
          </Typography>
        ),
      },
      {
        id: "shiftStatus",
        header: "État de poste",
        accessorKey: "shiftStatus",
        cell: info => (
          <Typography variant="body1" sx={{ width: "102px" }} color="initial">
            {info.getValue()}
          </Typography>
        ),
      },
      {
        id: "workTime",
        header: "Déb. - Fin",
        accessorFn: row =>
          `${formatDateTime(row.startTime)}-${formatDateTime(row.endTime)}`,
        cell: info => (
          <Typography variant="body1" color="initial" minWidth={100}>
            {info.getValue()}
          </Typography>
        ),
      },
      {
        id: "createdAt",
        header: "Créé à",
        accessorKey: "createdAt",
        cell: info => (
          <Typography variant="body1" color="initial" minWidth={100}>
            {formatToISODate(info.getValue())}
          </Typography>
        ),
      },
    ],
    [],
  );
};

export default useClockInRecordsColumns;
