import React, { useMemo } from "react";
import { Typography } from "@mui/material";
import { BSMenu } from "../../ui/control";
import { formatToISODate } from "../../../utils/times";
import { LongTextTypography } from "../../ui/content";

const useFunctionColumns = (
  handleOpenEditFunctionDrawer,
  handleOpenDeleteFunctionModal,
) => {
  return useMemo(
    () => [
      {
        id: "functionName",
        header: "Fonction",
        accessorKey: "functionName",
        cell: info => (
          <Typography variant="body1" color="initial">
            {info.getValue()}
          </Typography>
        ),
      },
      {
        id: "comment",
        header: "Commentaire",
        accessorKey: "comment",
        cell: info => (
          <LongTextTypography text={info.getValue()} maxLength={80} />
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
      {
        id: "_id",
        header: "",
        accessorKey: "_id",
        cell: info => {
          const buttons = [
            {
              label: "Modifier",
              onClick: () => handleOpenEditFunctionDrawer(info.getValue()),
              fullWidth: true,
            },
            {
              label: "Supprimer",
              onClick: () => handleOpenDeleteFunctionModal(info.getValue()),
              color: "error",
              fullWidth: true,
            },
          ];
          return <BSMenu buttons={buttons} />;
        },
      },
    ],
    [handleOpenEditFunctionDrawer, handleOpenDeleteFunctionModal],
  );
};

export default useFunctionColumns;
