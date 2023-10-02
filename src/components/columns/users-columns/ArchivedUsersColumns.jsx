import React, { useMemo } from "react";
import { Typography, Stack } from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { formatCanadianPhoneNumber } from "../../../utils/helpers";

const useArchivedUserColumn = () => {
  return useMemo(
    () => [
      {
        id: "registrationNumber",
        header: "N°",
        accessorKey: "registrationNumber",
        cell: info => (
          <Typography variant="body1" color="inherit">
            {info.getValue()}
          </Typography>
        ),
      },
      {
        id: "displayName",
        header: "Prenom et nom",
        accessorFn: row => row.displayName,
        cell: info => {
          return (
            <Typography variant="body1" color="initial">
              {info.getValue()}
            </Typography>
          );
        },
      },
      {
        id: "email",
        header: "Courriel",
        accessorKey: "email",
        cell: info => (
          <Stack flexDirection="row" alignItems="center" gap={1}>
            <MailOutlineIcon color="primary" />
            <Typography variant="body1" color="initial">
              {info.getValue()}
            </Typography>
          </Stack>
        ),
      },
      {
        id: "phoneNumber",
        header: "Cellulaire",
        accessorKey: "phoneNumber",
        cell: info => (
          <Typography variant="body1" color="initial">
            {formatCanadianPhoneNumber(info.getValue())}
          </Typography>
        ),
      },
    ],
    [],
  );
};

export default useArchivedUserColumn;
