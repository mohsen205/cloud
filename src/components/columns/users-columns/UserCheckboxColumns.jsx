import React from "react";
import { Typography, Stack, Avatar } from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { formatCanadianPhoneNumber } from "../../../utils/helpers";
import { createColumnHelper } from "@tanstack/react-table";
import { IndeterminateCheckbox } from "../../ui/input";
import { useSelector } from "react-redux";

const columnHelper = createColumnHelper();

const checkboxUserColumn = [
  columnHelper.accessor(row => row._id, {
    id: "_id",
    header: ({ table }) => (
      <IndeterminateCheckbox
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
        }}
      />
    ),
    cell: ({ row }) => (
      <IndeterminateCheckbox
        {...{
          checked: row.getIsSelected(),
          disabled: !row.getCanSelect(),
          indeterminate: row.getIsSomeSelected(),
          onChange: row.getToggleSelectedHandler(),
        }}
      />
    ),
  }),
  columnHelper.accessor(row => row.registrationNumber, {
    id: "registrationNumber",
    header: () => "N°",
    cell: info => (
      <Typography variant="body1" color="inherit">
        {info.getValue()}
      </Typography>
    ),
  }),
  columnHelper.accessor(row => [row.displayName, row.photoUrl], {
    id: "displayName",
    header: () => "Prenom et nom",
    cell: info => {
      const values = info.getValue();
      const { error, sasTokens } = useSelector(state => state.sasToken);
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
  }),
  columnHelper.accessor(row => row.email, {
    id: "email",
    header: () => "Courriel",
    cell: info => (
      <Stack flexDirection="row" alignItems="center" gap={1}>
        <MailOutlineIcon color="primary" />
        <Typography variant="body1" color="initial">
          {info.getValue()}
        </Typography>
      </Stack>
    ),
  }),
  columnHelper.accessor(row => row.phoneNumber, {
    id: "phoneNumber",
    header: () => "Cellulaire",
    cell: info => (
      <Typography variant="body1" color="initial">
        {formatCanadianPhoneNumber(info.getValue())}
      </Typography>
    ),
  }),
];

export default checkboxUserColumn;
