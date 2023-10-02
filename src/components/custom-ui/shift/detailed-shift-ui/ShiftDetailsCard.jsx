import React from "react";
import PropTypes from "prop-types";
import { Typography, Box, Stack, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { formatToISODate, formatToYYYYMMDD } from "../../../../utils/times";
import { getTimeOfDayInFrench } from "../../../../utils/helpers";

const ShiftDetailsCard = ({ data }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        backgroundColor: "white",
        p: 1,
        mb: 1.5,
        px: 2,
        borderRadius: `${theme.shape.borderRadius}px`,
      }}
    >
      <Stack direction="row" justifyContent="space-between">
        <Box>
          <Typography variant="subtitle2">N°:</Typography>
          <Typography variant="subtitle1" color="initial">
            {data.shiftNumber}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2">Nom du client:</Typography>
          <Link to="/dashboard/clients">
            <Typography
              variant="subtitle1"
              sx={{ textTransform: "capitalize" }}
              color="initial"
            >
              {data.client.clientName || "--"}
            </Typography>
          </Link>
        </Box>
        <Box>
          <Typography variant="subtitle2">Date:</Typography>
          <Typography variant="subtitle1" color="initial">
            {formatToISODate(data.date)}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2">Déb. - Fin:</Typography>
          <Typography variant="subtitle1" color="initial">
            {data.startTime} - {data.endTime}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2">Poste demandé:</Typography>
          <Typography variant="subtitle1" color="initial">
            {data.requestedPosition.functionName || "--"}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2">Type shift:</Typography>
          <Typography
            variant="subtitle1"
            color="initial"
            sx={{ textTransform: "capitalize" }}
          >
            {getTimeOfDayInFrench(data.type) || "--"}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2">Créé à:</Typography>
          <Typography
            variant="subtitle1"
            color="initial"
            sx={{ textTransform: "capitalize" }}
          >
            {formatToYYYYMMDD(data.createdAt)}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default ShiftDetailsCard;

ShiftDetailsCard.propTypes = {
  data: PropTypes.object.isRequired,
};
