import React, { useMemo } from "react";
import { Typography, Stack, Avatar } from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { formatCanadianPhoneNumber } from "../../../utils/helpers";
import { useSelector } from "react-redux";

const useBasicUserColumn = () => {
  const { error, sasTokens } = useSelector(state => state.sasToken);
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
        accessorFn: row => [row.displayName, row.photoUrl],
        cell: info => {
          const values = info.getValue();
          return (
            <>
              <Stack flexDirection="row" alignItems="center" gap={1}>
                <Avatar
                  src={error ? null : `${values[1]}?${sasTokens.fileStorage}`}
                  alt={values[0]}
                />
                <Typography variant="body1" color="initial">
                  {values[0]}
                </Typography>
              </Stack>
            </>
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

export default useBasicUserColumn;
