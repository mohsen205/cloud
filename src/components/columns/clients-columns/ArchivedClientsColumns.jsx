import React, { useMemo } from "react";
import { Typography, Link, Button } from "@mui/material";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import {
  formatCanadianPhoneNumber,
  extractSubdomain,
} from "../../../utils/helpers";
import { formatToISODate } from "../../../utils/times";

const useArchivedClientColumn = () => {
  return useMemo(
    () => [
      {
        id: "client",
        header: "Nom du client",
        accessorKey: "clientName",
        cell: info => (
          <Typography variant="body1" color="initial" p={1}>
            {info.getValue()}
          </Typography>
        ),
      },
      {
        id: "responsible",
        header: "Manager",
        accessorKey: "responsible",
        cell: info => (
          <Typography variant="body1" color="initial">
            {info.getValue()}
          </Typography>
        ),
      },
      {
        id: "email",
        header: "Email",
        accessorKey: "email",
        cell: info => (
          <Typography variant="body1" color="initial">
            {info.getValue()}
          </Typography>
        ),
      },
      {
        id: "phoneNumber",
        header: "N° téléphone",
        accessorKey: "phoneNumber",
        cell: info => (
          <Typography variant="body1" color="initial">
            {formatCanadianPhoneNumber(info.getValue())}
          </Typography>
        ),
      },
      {
        id: "website",
        header: "Site web",
        accessorKey: "website",
        cell: info => (
          <Link
            href={info.getValue()}
            target="_blank"
            rel="noopener noreferrer"
            variant="body1"
          >
            {extractSubdomain(info.getValue())}
          </Link>
        ),
      },
      {
        id: "address",
        header: "adresse",
        accessorKey: "address",
        cell: info => (
          <Button
            startIcon={<MapOutlinedIcon />}
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              info.getValue(),
            )}`}
            variant="contained"
            target="_blank"
            rel="noopener noreferrer"
            color="info"
          >
            aperçu
          </Button>
        ),
      },
      {
        id: "createdAt",
        header: "Créé à",
        accessorKey: "createdAt",
        cell: info => (
          <Typography variant="body1" color="initial">
            {formatToISODate(info.getValue())}
          </Typography>
        ),
      },
    ],
    [],
  );
};

export default useArchivedClientColumn;
