import React from "react";
import {
  IconButton,
  Typography,
  Box,
  Container,
  Avatar,
  List,
  ListItemIcon,
  ListItem,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import PropTypes from "prop-types";
import { formatToISODate } from "../../../utils/times";
import BoxCentered from "../../utils/BoxCentered";
import constant from "../../../../constant.js";
import { BSDrawer } from "../../ui/control";
import { Loading, ErrorMessage } from "../../ui/informative";
import { useQuery } from "react-query";
import api from "../../../utils/api";
import { useSelector } from "react-redux";
import FileMangement from "./FileMangement";

const { httpsEndpoint } = constant;

const getUserData = async id => {
  const response = await api.get(`${httpsEndpoint}/user/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("id-token")}`,
    },
  });
  return response.data;
};

const DisplayUserDetails = ({ open, setOpen, id }) => {
  if (id === "") return null;

  const { error, sasTokens } = useSelector(state => state.sasToken);

  const { data, isLoading, isError } = useQuery(
    ["UserData", id],
    () => getUserData(id),
    {
      enabled: !!id,
    },
  );

  return (
    <BSDrawer
      sx={{
        width: "500px",
        "& .MuiDrawer-paper": {
          width: "500px",
        },
      }}
      open={open}
      setOpen={setOpen}
    >
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <ErrorMessage />
      ) : (
        <Container sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" color="initial">
              Détails du travailleur
            </Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box>
            <BoxCentered>
              <Avatar
                src={error ? null : `${data.photoUrl}?${sasTokens.fileStorage}`}
                alt={`${data.firstName} ${data.lastName}`}
                sx={{
                  width: 150,
                  height: 150,
                }}
              />
            </BoxCentered>
            <Typography variant="body1" color="initial" textAlign="center">
              {data.firstName} {data.lastName}
            </Typography>
            <Typography variant="body2" color="grey.700" textAlign="center">
              {data.mainFunction.functionName}
            </Typography>
          </Box>
          <Typography variant="h6" color="initial">
            Plus d&apos;information
          </Typography>
          <List dense={true}>
            <ListItem>
              <ListItemIcon>
                <BadgeOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary={data.registrationNumber} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <EmailOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary={data.email} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LocalPhoneOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary={data.phoneNumber} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <WorkOutlineOutlinedIcon />
              </ListItemIcon>
              <ListItemText
                primary={data.mainFunction.functionName}
                secondary={
                  data.subFunctions !== null
                    ? data.subFunctions.map(
                        (subFunction, index) =>
                          `${subFunction.functionName} ${
                            index !== data.subFunctions.length - 1 && "/ "
                          }`,
                      )
                    : "--"
                }
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <FmdGoodOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary={data.address} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CakeOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary={formatToISODate(data.birthdayDate)} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CommentOutlinedIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  data?.comment === null || data?.comment === ""
                    ? "--"
                    : data.comment
                }
              />
            </ListItem>
          </List>
          <FileMangement attachments={data?.attachments} />
        </Container>
      )}
    </BSDrawer>
  );
};

export default DisplayUserDetails;

DisplayUserDetails.propTypes = {
  id: PropTypes.string.isRequired,
  setOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
