import React, { useMemo } from "react";
import { Typography } from "@mui/material";
import { BSMenu } from "../../ui/control";
import { formatToISODate } from "../../../utils/times";
import { getTimeOfDayInFrench } from "../../../utils/helpers";
import { BSButton } from "../../ui/control/costum-control";

const useDraftShiftColumns = (
  handleOpenEditDrawer,
  handleOpenDeleteModal,
  handleOpenPublishModal,
  handleOpenArchiveModal,
) => {
  return useMemo(
    () => [
      {
        id: "shiftNumber",
        header: "N°",
        accessorKey: "shiftNumber",
        cell: info => (
          <Typography variant="body1" color="initial" minWidth={100}>
            {info.getValue()}
          </Typography>
        ),
      },
      {
        id: "clientName",
        header: "Nom du client",
        accessorFn: row => row.client.clientName,
        cell: info => (
          <Typography variant="body1" color="initial">
            {info.getValue()}
          </Typography>
        ),
      },
      {
        id: "date",
        header: "Date",
        accessorKey: "date",
        cell: info => (
          <Typography variant="body1" color="initial" minWidth={100}>
            {formatToISODate(info.getValue())}
          </Typography>
        ),
      },
      {
        id: "workTime",
        header: "Déb. - Fin",
        accessorFn: row => `${row.startTime} - ${row.endTime}`,
        cell: info => (
          <Typography variant="body1" color="initial" minWidth={100}>
            {info.getValue()}
          </Typography>
        ),
      },
      {
        id: "functionName",
        header: "Poste demandé",
        accessorFn: row => row.requestedPosition.functionName,
        cell: info => (
          <Typography variant="body1" sx={{ minWidth: 115 }} color="initial">
            {info.getValue()}
          </Typography>
        ),
      },
      {
        id: "type",
        header: "Type shift",
        accessorKey: "type",
        cell: info => (
          <Typography variant="body1" sx={{ width: "102px" }} color="initial">
            {getTimeOfDayInFrench(info.getValue())}
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
      {
        id: "status",
        header: "Statut",
        accessorKey: "_id",
        cell: info => (
          <BSButton id={info.getValue()} openModal={handleOpenPublishModal} />
        ),
      },
      {
        id: "_id",
        header: "",
        accessorKey: "_id",
        cell: info => {
          const buttons = [
            {
              label: "Modifier",
              onClick: () => handleOpenEditDrawer(info.getValue()),
              fullWidth: true,
            },
            {
              label: "Supprimer",
              onClick: () => handleOpenDeleteModal(info.getValue()),
              color: "error",
              fullWidth: true,
            },
            {
              label: "Archiver",
              onClick: () => handleOpenArchiveModal(info.getValue()),
              color: "warning",
              fullWidth: true,
            },
          ];
          return <BSMenu buttons={buttons} />;
        },
      },
    ],
    [
      handleOpenEditDrawer,
      handleOpenDeleteModal,
      handleOpenPublishModal,
      handleOpenArchiveModal,
    ],
  );
};

export default useDraftShiftColumns;
