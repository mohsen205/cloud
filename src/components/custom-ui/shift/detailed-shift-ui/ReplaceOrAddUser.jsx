import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useQuery } from "react-query";
import { Button, styled, Box, FormHelperText } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { BSModal } from "../../../ui/content";
import constant from "../../../../../constant";
import { checkboxUserColumn } from "../../../columns";
import {
  BSSnackbar,
  ErrorMessage,
  NoDataMessage,
} from "../../../ui/informative";
import { TanstackSelectedRowTable } from "../../../ui/table";
import api from "../../../../utils/api";

const { httpsEndpoint } = constant;

const ButtonBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  marginTop: theme.spacing(2),
}));

const fetchShiftlessUsers = async ({
  date,
  startTime,
  endTime,
  requestedPosition,
}) => {
  const response = await api.post(
    `${httpsEndpoint}/users/without-shifts`,
    { date, startTime, endTime, requestedPosition },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("id-token")}`,
      },
    },
  );

  return response.data;
};

const ReplaceOrAddUser = ({ open, setOpen, id, shiftData }) => {
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedValuesError, setSelectedValuesError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [handleOpenSnackbar, setHandleOpenSnackbar] = useState({
    open: false,
    severity: "error",
    message: "",
  });

  const { date, startTime, endTime, requestedPosition } = shiftData;

  const { data, isLoading, isError } = useQuery(
    ["shiftlessUsers", { date, startTime, endTime, requestedPosition }],
    fetchShiftlessUsers,
    {
      enabled: open,
    },
  );

  useEffect(() => {
    if (isSubmitting) {
      if (selectedValues.length !== 0) {
        setSelectedValuesError(false);
      } else if (selectedValues.length === 0) {
        setSelectedValuesError(true);
      } else if (selectedValues.length < 1) {
        setSelectedValuesError(true);
      } else {
        setSelectedValuesError(false);
      }
    }
  }, [selectedValues, isSubmitting]);

  const handleReplaceOrChangeUser = () => {
    setIsSubmitting(true);

    if (selectedValuesError) {
      setIsSubmitting(false);
      return;
    }

    api
      .put(
        `${httpsEndpoint}/shift/${id}/replace-or-add-user`,
        {
          userId: selectedValues.map(row => row.original._id),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("id-token")}`,
          },
        },
      )
      .then(_ => {
        setHandleOpenSnackbar({
          open: true,
          severity: "success",
          message: "Le planificateur de quart de travail avec succès",
        });

        const closeModal = setTimeout(() => {
          setOpen(false);
        }, 1500);

        return () => clearTimeout(closeModal);
      })
      .catch(_ => {
        setHandleOpenSnackbar({
          open: true,
          severity: "error",
          message: "Quelque chose s'il vous plaît réessayer plus tard",
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <>
      <BSSnackbar
        open={handleOpenSnackbar.open}
        severity={handleOpenSnackbar.severity}
        setOpen={setHandleOpenSnackbar}
        message={handleOpenSnackbar.message}
      />
      <BSModal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ overflowY: "auto", maxHeight: "75vh" }}>
          {isError ? (
            <ErrorMessage />
          ) : data && data.length === 0 ? (
            <NoDataMessage />
          ) : (
            <TanstackSelectedRowTable
              data={data}
              columns={checkboxUserColumn}
              isLoading={isLoading}
              pageCount={!isLoading && data?.length}
              getSelectedValues={setSelectedValues}
            />
          )}
        </Box>
        <FormHelperText sx={{ color: "error.main" }}>
          {selectedValuesError &&
            "Vous devez sélectionner un seule travailleur."}
        </FormHelperText>
        <ButtonBox>
          <Button
            color="secondary"
            onClick={() => setOpen(false)}
            sx={{ mr: 1, width: 150 }}
          >
            Annuler
          </Button>
          <LoadingButton
            variant="contained"
            onClick={handleReplaceOrChangeUser}
            sx={{ width: 150 }}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Confirmer
          </LoadingButton>
        </ButtonBox>
      </BSModal>
    </>
  );
};

export default ReplaceOrAddUser;

ReplaceOrAddUser.propTypes = {
  id: PropTypes.string.isRequired,
  setOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  shiftData: PropTypes.object.isRequired,
};
