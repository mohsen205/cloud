import React, { useEffect, useState } from "react";
import {
  IconButton,
  Typography,
  Box,
  Container,
  FormControl,
  InputLabel,
  Stack,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import PropTypes from "prop-types";
import { useQuery } from "react-query";
import { BSRadioGroup, BSTextField } from "../../../ui/input";
import constant from "../../../../../constant.js";
import {
  BSSnackbar,
  ErrorMessage,
  Loading,
} from "../../../ui/informative/index.js";
import { BSDrawer } from "../../../ui/control";
import { formatToYYYYMMDD } from "../../../../utils/times";
import UserCheckboxList from "./UserCheckboxList";
import { FSelectMenu, CSelectMenu } from "../../../ui/input/costum-input";
import api from "../../../../utils/api";

const { httpsEndpoint } = constant;

const initialValues = {
  client: "",
  date: "",
  startTime: "07:00",
  endTime: "15:00",
  type: "day",
  requestedPosition: "",
  publicationTarget: "all",
  selectedPublicationTargets: [],
  publicationDate: "now",
  publicationDateTime: "",
};

const validationSchema = Yup.object({
  client: Yup.string().required("Le nom du client est requis"),
  date: Yup.date().required("La date est requise"),
  startTime: Yup.string().required("L'heure de début est requise"),
  endTime: Yup.string().required("L'heure de fin est requise"),
  type: Yup.string().required("Le type de shift est requis"),
  requestedPosition: Yup.string().required("Le poste demandé est requis"),
  publicationDate: Yup.string().required("La date de publication est requise"),
  publicationDateTime: Yup.string().when("publicationDate", {
    is: publicationDate => publicationDate === "specific",
    then: () => Yup.string().required("La date de publication est requise"),
  }),
  selectedPublicationTargets: Yup.mixed().when("publicationTarget", {
    is: "specific",
    then: () =>
      Yup.array()
        .required("Les cibles de publication spécifiques sont requises")
        .min(
          1,
          "Veuillez sélectionner au moins une cible de publication spécifique",
        ),
  }),
});

const getShiftData = async id => {
  const response = await api.get(`${httpsEndpoint}/shift/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("id-token")}`,
    },
  });
  return response.data;
};

const EditShift = ({ open, setOpen, id }) => {
  if (id === "") return null;
  const [initialShiftsValue, setInitialShiftsValue] = useState({});
  const [handleOpenSnackbar, setHandleOpenSnackbar] = useState({
    open: false,
    severity: "error",
    message: "",
  });

  const { data, isLoading, isError, refetch } = useQuery(
    ["shiftData", id],
    () => getShiftData(id),
    {
      enabled: !!id,
    },
  );

  useEffect(() => {
    if (!isLoading) {
      setInitialShiftsValue({
        client: { _id: data.client._id, clientName: data.client.clientName },
        date: formatToYYYYMMDD(data.date),
        startTime: data.startTime,
        endTime: data.endTime,
        type: data.type,
        requestedPosition: {
          _id: data.requestedPosition._id,
          functionName: data.requestedPosition.functionName,
        },
        publicationTarget:
          data.publicationTargets === "all" ? "all" : "specific",
        selectedPublicationTargets:
          data.publicationTargets === "all" ? [] : data.publicationTargets,
        publicationDate: data.publicationDate === null ? "later" : "specific",
        publicationDateTime:
          data.publicationDate !== null &&
          formatToYYYYMMDD(data.publicationDate),
      });
    }
  }, [data, isLoading]);

  const onSubmit = (values, actions) => {
    const { setSubmitting, setValues } = actions;
    const {
      client,
      endTime,
      type,
      date,
      startTime,
      publicationTarget,
      selectedPublicationTargets,
      requestedPosition,
      publicationDate,
      publicationDateTime,
    } = values;

    const _publicationDate =
      publicationDate === "specific" ? publicationDateTime : publicationDate;
    const _publicationTargets =
      publicationTarget === "specific"
        ? selectedPublicationTargets.map(user => user._id)
        : "all";

    api
      .put(
        `${httpsEndpoint}/shift/${id}`,
        {
          client: client,
          date,
          startTime,
          endTime,
          type,
          requestedPosition,
          publicationTargets: _publicationTargets,
          publicationDate: _publicationDate,
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
          message: "Le Fonction a été ajouté avec succès",
        });

        setValues(initialValues);

        refetch();

        setOpen(false);
      })
      .catch(_ => {
        setHandleOpenSnackbar({
          open: true,
          severity: "error",
          message:
            "Quelque chose s'est mal passé. Veuillez réessayer plus tard.",
        });
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <>
      <BSSnackbar
        open={handleOpenSnackbar.open}
        severity={handleOpenSnackbar.severity}
        setOpen={setHandleOpenSnackbar}
        message={handleOpenSnackbar.message}
      />
      <BSDrawer
        open={open}
        setOpen={setOpen}
        sx={{
          width: "670px",
          "& .MuiDrawer-paper": {
            width: "670px",
          },
        }}
      >
        {isLoading && Object.keys(initialShiftsValue).length === 0 ? (
          <Loading />
        ) : isError ? (
          <ErrorMessage />
        ) : (
          <Container sx={{ pb: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6" color="initial">
                Modifier Shift
              </Typography>
              <IconButton
                onClick={() => setOpen(false)}
                aria-label="close-drawer"
              >
                <CloseIcon />
              </IconButton>
              {/* Fap */}
            </Box>
            <Box>
              <Formik
                initialValues={initialShiftsValue || initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
                enableReinitialize
              >
                {({ isSubmitting, setFieldValue, values, errors }) => {
                  const {
                    publicationDate,
                    publicationTarget,
                    type,
                    date,
                    startTime,
                    endTime,
                    requestedPosition,
                    selectedPublicationTargets,
                  } = values;

                  return (
                    <Form>
                      <Stack gap={1}>
                        <Typography variant="h5" color="initial">
                          Informations générales
                        </Typography>
                        <Divider />
                        <Stack flexDirection="row" gap={2}>
                          {/* Client Name */}
                          <FormControl
                            variant="standard"
                            sx={{
                              width: "300px",
                            }}
                          >
                            <InputLabel shrink htmlFor="client">
                              Nom du client
                            </InputLabel>
                            <CSelectMenu name="client" />
                          </FormControl>

                          {/* Date */}
                          <FormControl variant="standard">
                            <InputLabel shrink htmlFor="date">
                              Date
                            </InputLabel>
                            <BSTextField name="date" type="date" />
                          </FormControl>
                        </Stack>

                        {/* Shift type */}

                        <BSRadioGroup
                          label="Type de shift"
                          name="type"
                          row
                          onChange={event => {
                            const selectedShift = event.target.value;
                            setFieldValue("type", selectedShift);
                            if (selectedShift === "day") {
                              setFieldValue("startTime", "07:00");
                              setFieldValue("endTime", "15:00");
                            } else if (selectedShift === "evening") {
                              setFieldValue("startTime", "15:00");
                              setFieldValue("endTime", "23:00");
                            } else if (selectedShift === "night") {
                              setFieldValue("startTime", "23:00");
                              setFieldValue("endTime", "07:00");
                            } else if (selectedShift === "other") {
                              setFieldValue("startTime", "");
                              setFieldValue("endTime", "");
                            }
                          }}
                          options={[
                            { value: "day", label: "Jour" },
                            { value: "evening", label: "Soir" },
                            { value: "night", label: "Nuit" },
                            { value: "other", label: "Autre" },
                          ]}
                        />

                        <Stack flexDirection="row" gap={2}>
                          {/* Start time */}
                          <FormControl variant="standard">
                            <InputLabel shrink htmlFor="startTime">
                              Heure de début
                            </InputLabel>

                            <BSTextField
                              name="startTime"
                              type="time"
                              disabled={
                                type === "day" ||
                                type === "evening" ||
                                type === "night"
                              }
                            />
                          </FormControl>

                          {/* End Time */}
                          <FormControl variant="standard">
                            <InputLabel shrink htmlFor="endTime">
                              Heure de fin
                            </InputLabel>
                            <BSTextField
                              name="endTime"
                              type="time"
                              disabled={
                                values.type === "day" ||
                                values.type === "evening" ||
                                values.type === "night"
                              }
                            />
                          </FormControl>
                        </Stack>

                        <FormControl variant="standard">
                          <InputLabel shrink htmlFor="requestedPosition">
                            Poste demandé
                          </InputLabel>
                          <FSelectMenu name="requestedPosition" />
                        </FormControl>

                        <Typography variant="h5" color="initial">
                          Informations sur la publication
                        </Typography>
                        <Divider />

                        {/* Publish to all */}
                        <BSRadioGroup
                          name="publicationTarget"
                          label="Diffuser Pour"
                          row
                          options={[
                            { value: "all", label: "Tous" },
                            {
                              value: "specific",
                              label: "Travailleur spécifique",
                            },
                          ]}
                        />

                        {publicationTarget === "specific" && (
                          <UserCheckboxList
                            contextValues={{
                              date,
                              startTime,
                              endTime,
                              type,
                              requestedPosition,
                              setFieldValue,
                              selectedPublicationTargets,
                            }}
                          />
                        )}

                        <BSRadioGroup
                          name="publicationDate"
                          label="Date de diffusion"
                          row
                          options={[
                            { value: "now", label: "Maintenant" },
                            { value: "later", label: "Plus tard" },
                            { value: "specific", label: "Date Spécifique" },
                          ]}
                        />

                        {publicationDate === "specific" && (
                          <FormControl variant="standard">
                            <BSTextField
                              name="publicationDateTime"
                              type="date"
                            />
                          </FormControl>
                        )}

                        <LoadingButton
                          type="submit"
                          variant="contained"
                          size="medium"
                          fullWidth={true}
                          loading={isSubmitting}
                          disabled={isSubmitting}
                        >
                          Ajouter et publier un Shift
                        </LoadingButton>
                      </Stack>
                    </Form>
                  );
                }}
              </Formik>
            </Box>
          </Container>
        )}
      </BSDrawer>
    </>
  );
};

export default EditShift;

EditShift.propTypes = {
  setOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
};
