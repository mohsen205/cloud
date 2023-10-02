import React, { useMemo } from "react";
import { Stack, Typography, Avatar, Box, IconButton } from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import AspectRatioOutlinedIcon from "@mui/icons-material/AspectRatioOutlined";
import { useSelector } from "react-redux";
import { BSMenu } from "../../ui/control";
import { StatusChip } from "../../ui/informative";
import { getTimeFromDate } from "../../../utils/times";

const useApprovalShiftColumns = (
  resizeConfirmationImage,
  handleAprroveModal,
) => {
  const { error, sasTokens } = useSelector(state => state.sasToken);
  return useMemo(
    () => [
      {
        id: "displayName",
        header: "Prenom et nom",
        accessorFn: row => [row.userId.displayName, row.userId.photoUrl],
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
        accessorFn: row => row.userId.email,
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
        id: "startTime",
        header: "Heure de démarrage",
        accessorKey: "startTime",
        cell: info => (
          <Typography variant="body1" color="initial">
            {info.getValue() ? getTimeFromDate(info.getValue()) : "--"}
          </Typography>
        ),
      },
      {
        id: "endTime",
        header: "Heure de fin",
        accessorKey: "endTime",
        cell: info => (
          <Typography variant="body1" color="initial">
            {info.getValue() ? getTimeFromDate(info.getValue()) : "--"}
          </Typography>
        ),
      },
      {
        id: "shiftStatus",
        header: "Statut",
        accessorKey: "shiftStatus",
        cell: info => <StatusChip status={info.getValue()} />,
      },
      {
        id: "photoUrl",
        header: "Photo de confirmation",
        accessorFn: row => [row.photoUrl, row.userId.displayName],
        cell: info => {
          const values = info.getValue();
          return (
            <Box>
              {values[0] ? (
                <Box
                  sx={{
                    position: "relative",
                    display: "inline-block",
                    minWidth: "165px",
                  }}
                >
                  <Box
                    component="img"
                    src={error ? null : `${values[0]}?${sasTokens.fileStorage}`}
                    width="150px"
                    sx={{ borderRadius: "10px" }}
                    alt={`${values[1]} approval photo `}
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      opacity: 0,
                      transition: "opacity 0.3s",
                      "&:hover": {
                        opacity: 1,
                      },
                    }}
                    onClick={() => resizeConfirmationImage(values[0])}
                  >
                    <AspectRatioOutlinedIcon />
                  </IconButton>
                </Box>
              ) : (
                <Typography variant="body1" color="initial">
                  --
                </Typography>
              )}
            </Box>
          );
        },
      },
      {
        id: "_id",
        header: "",
        accessorFn: row => row.userId._id,
        cell: info => {
          const buttons = [
            {
              label: "Approuver",
              onClick: () => handleAprroveModal(info.getValue()),
              color: "info",
              fullWidth: true,
            },
          ];
          return <BSMenu buttons={buttons} />;
        },
      },
    ],
    [resizeConfirmationImage, handleAprroveModal],
  );
};

export default useApprovalShiftColumns;
