import React, { useMemo } from "react";
import { Typography, Avatar, AvatarGroup } from "@mui/material";
import { BSMenu } from "../../ui/control";
import { formatToISODate } from "../../../utils/times";
import { getTimeOfDayInFrench } from "../../../utils/helpers";
import { useSelector } from "react-redux";

const useAwaitingShiftColumns = (
  handleOpenAllocateModal,
  handleOpenDeleteModal,
) => {
  const { error, sasTokens } = useSelector(state => state.sasToken);
  return useMemo(
    () => [
      {
        id: "shiftNumber",
        header: "N°",
        accessorKey: "shiftNumber",
        cell: info => (
          <Typography variant="body1" color="initial">
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
          <Typography variant="body1" color="initial">
            {formatToISODate(info.getValue())}
          </Typography>
        ),
      },
      {
        id: "workTime",
        header: "Déb. - Fin",
        accessorFn: row => `${row.startTime} - ${row.endTime}`,
        cell: info => (
          <Typography variant="body1" color="initial">
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
        id: "userConfirmations",
        header: "Confirmations",
        accessorKey: "userConfirmations",
        cell: info => {
          if (info.getValue().length === 0) {
            return "--";
          } else {
            return (
              <AvatarGroup total={info.getValue().length} max={4}>
                {info.getValue().map(user => {
                  return (
                    <Avatar
                      key={user.displayName}
                      alt={user.displayName}
                      src={
                        error
                          ? null
                          : `${user.photoUrl}?${sasTokens.fileStorage}`
                      }
                    />
                  );
                })}
              </AvatarGroup>
            );
          }
        },
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
      {
        id: "_id",
        header: "",
        accessorKey: "_id",
        cell: info => {
          const buttons = [
            {
              label: "Assigner Travailleur",
              onClick: () => handleOpenAllocateModal(info.getValue()),
              color: "primary",
              fullWidth: true,
            },
            {
              label: "Supprimer",
              onClick: () => handleOpenDeleteModal(info.getValue()),
              color: "error",
              fullWidth: true,
            },
          ];
          return <BSMenu buttons={buttons} />;
        },
      },
    ],
    [handleOpenAllocateModal, handleOpenDeleteModal],
  );
};

export default useAwaitingShiftColumns;
