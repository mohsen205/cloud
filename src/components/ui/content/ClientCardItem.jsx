import React, { useState } from "react";
import { CardActions, Card, CardContent, Typography } from "@mui/material";
import PinDropIcon from "@mui/icons-material/PinDrop";
import PhoneIcon from "@mui/icons-material/Phone";
import MapIcon from "@mui/icons-material/Map";
import LanguageIcon from "@mui/icons-material/Language";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { Button, Stack, Link } from "@mui/material";
import PropTypes from "prop-types";
import {
  ArchiveClient,
  DeleteClient,
  EditClient,
} from "../../custom-ui/clients";

const ClientCardItem = ({
  address,
  clientName,
  phoneNumber,
  responsible,
  website,
  email,
  _id,
}) => {
  const [openDeleteClientData, setOpenDeleteClientData] = useState(false);
  const [openArchiveClientData, setOpenArchiveClientData] = useState(false);
  const [isDrawerOpoen, setIsDrawerOpen] = useState(false);

  const modifyHandler = () => {
    setIsDrawerOpen(true);
  };

  return (
    <>
      <Card
        sx={{
          minHeight: 360,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <CardContent sx={{ backgroundColor: "white", flex: 1 }}>
          <Stack>
            <Typography
              gutterBottom
              variant="h6"
              component="p"
              sx={{ color: "#126662", textTransform: "uppercase" }}
            >
              {clientName}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" sx={{ my: 1 }}>
            <PinDropIcon sx={{ mx: 1 }} fontSize="small" />
            <Typography variant="body2">{address}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center">
            <PhoneIcon sx={{ mx: 1 }} fontSize="small" />
            <Typography gutterBottom variant="body2" component="div">
              {phoneNumber}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" sx={{ my: 1 }}>
            <MapIcon sx={{ mx: 1 }} fontSize="small" />
            <Typography gutterBottom variant="body2" component="div">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  address,
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                Afficher sur la carte
              </a>
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" sx={{ my: 1 }}>
            <LanguageIcon sx={{ mx: 1 }} fontSize="small" />
            <Link href={website} target="blank">
              {website}
            </Link>
          </Stack>
          <Stack direction="row" alignItems="center" sx={{ my: 1 }}>
            <AttachEmailIcon sx={{ mx: 1 }} fontSize="small" />
            <Link rel="noopener noreferrer" href={`mailto:${email}`}>
              {email}
            </Link>
          </Stack>
          <Stack direction="row" alignItems="center" sx={{ my: 1 }}>
            <SupervisorAccountIcon sx={{ mx: 1 }} fontSize="small" />
            <Typography gutterBottom variant="body2" component="div">
              {responsible}
            </Typography>
          </Stack>
        </CardContent>
        <CardActions
          sx={{
            backgroundColor: "#F1F4FA",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button variant="contained" size="small" onClick={modifyHandler}>
            Modifier
          </Button>
          <Button
            variant="contained"
            size="small"
            color="warning"
            onClick={() => setOpenArchiveClientData(true)}
          >
            Archiver
          </Button>

          <Button
            variant="contained"
            size="small"
            color="error"
            onClick={() => setOpenDeleteClientData(true)}
          >
            supprimer
          </Button>
        </CardActions>
      </Card>

      <DeleteClient
        id={_id}
        open={openDeleteClientData}
        setOpen={setOpenDeleteClientData}
      />

      <ArchiveClient
        id={_id}
        open={openArchiveClientData}
        setOpen={setOpenArchiveClientData}
      />

      <EditClient id={_id} open={isDrawerOpoen} setOpen={setIsDrawerOpen} />
    </>
  );
};

export default ClientCardItem;

ClientCardItem.propTypes = {
  address: PropTypes.string,
  clientName: PropTypes.string,
  phoneNumber: PropTypes.string,
  responsible: PropTypes.string,
  website: PropTypes.string,
  email: PropTypes.string,
  _id: PropTypes.string,
};
