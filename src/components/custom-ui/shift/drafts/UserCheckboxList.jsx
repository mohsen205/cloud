import React, { useState, useEffect } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import PropTypes from "prop-types";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  FormHelperText,
} from "@mui/material";
import api from "../../../../utils/api";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import constant from "../../../../../constant";
import UserListTableModal from "./UserListTableModal";
import { BSTextField } from "../../../ui/input";
import { formatCanadianPhoneNumber } from "../../../../utils/helpers";

const { httpsEndpoint } = constant;

const UserCheckboxList = ({ contextValues }) => {
  const {
    date,
    startTime,
    endTime,
    requestedPosition,
    selectedPublicationTargets,
    setFieldValue,
  } = contextValues;

  const [submitButtonState, setSubmitButtonState] = useState({
    disabled: false,
    error: "",
  });

  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchData = () => {
    setIsLoading(true);
    setIsError(false);

    api
      .post(
        `${httpsEndpoint}/users/without-shifts`,
        { date, startTime, endTime, requestedPosition },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("id-token")}`,
          },
        },
      )
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.log(error);
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleShiftlessUsers = () => {
    fetchData();
    setOpenModal(true);
  };

  const handleDelete = id => {
    setFieldValue(
      "selectedPublicationTargets",
      selectedPublicationTargets.filter(user => user._id !== id),
    );
  };

  useEffect(() => {
    const isEmpty =
      !date ||
      !startTime ||
      !endTime ||
      !requestedPosition ||
      !selectedPublicationTargets;
    if (isEmpty) {
      // If any of the values are empty, set the button state to disabled and provide an error message.
      setSubmitButtonState({
        disabled: true,
        error: "Please fill in all required fields.",
      });
    } else {
      setSubmitButtonState({
        disabled: false,
        error: "",
      });
    }
  }, [date, startTime, endTime, requestedPosition, selectedPublicationTargets]);

  return (
    <>
      <Box>
        <Box>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h6" color="initial">
              Liste des travailleurs
            </Typography>
            <IconButton
              onClick={handleShiftlessUsers}
              disabled={submitButtonState.disabled}
            >
              <AddOutlinedIcon />
            </IconButton>
          </Stack>
          <FormHelperText sx={{ color: "error.main" }}>
            {submitButtonState.error}
          </FormHelperText>
        </Box>
      </Box>
      {selectedPublicationTargets?.length > 0 && (
        <Box className="basic-table">
          <table>
            <thead>
              <tr>
                <th>Prenom et nom</th>
                <th>Courriel</th>
                <th>Cellulaire</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {selectedPublicationTargets.map(user => {
                return (
                  <tr key={user._id}>
                    <td>
                      <Typography variant="body2" color="grey.500">
                        {user.displayName}
                      </Typography>
                    </td>
                    <td>
                      <Typography variant="body2" color="grey.500">
                        {user.email}
                      </Typography>
                    </td>
                    <td>
                      <Typography variant="body2" color="grey.500">
                        {formatCanadianPhoneNumber(user.phoneNumber)}
                      </Typography>
                    </td>
                    <td>
                      <IconButton onClick={() => handleDelete(user._id)}>
                        <DeleteOutlinedIcon />
                      </IconButton>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Box>
      )}

      <Box sx={{ marginTop: "-20px !important" }}>
        <BSTextField name="selectedPublicationTargets" type="hidden" />
      </Box>

      <UserListTableModal
        open={openModal}
        setOpen={setOpenModal}
        data={data}
        isLoading={isLoading}
        isError={isError}
        contextValues={contextValues}
      />
    </>
  );
};

export default UserCheckboxList;

UserCheckboxList.propTypes = {
  contextValues: PropTypes.object.isRequired,
};
