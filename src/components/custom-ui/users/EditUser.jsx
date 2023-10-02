/* eslint-disable guard-for-in */
import React, { useEffect, useState } from "react";
import {
  IconButton,
  Typography,
  Box,
  Container,
  FormControl,
  InputLabel,
  Stack,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Formik, Form } from "formik";
import { BSTextField, BSTextarea, FileUpload } from "../../ui/input";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import PropTypes from "prop-types";
import { useQuery } from "react-query";
import constant from "../../../../constant.js";
import { BSSnackbar, Loading, ErrorMessage } from "../../ui/informative";
import { BSDrawer } from "../../ui/control";
import {
  CostumBSFieldArray,
  FSelectMenu,
  MFSelectMenu,
} from "../../ui/input/costum-input";
import { formatToYYYYMMDD } from "../../../utils/times";
import api from "../../../utils/api";
import { useSelector } from "react-redux";

const { httpsEndpoint } = constant;

const initialValues = {
  userPhoto: "",
  firstName: "",
  lastName: "",
  email: "",
  mainFunction: "",
  subFunctions: [],
  phoneNumber: "",
  birthdayDate: "",
  address: "",
  comment: "",
  attachmentFiles: [{ fileDescription: "", file: {} }],
};

const validationSchema = Yup.object({
  // userPhoto: Yup.mixed()
  //   .test("is-image", "Format d'image invalide", value => {
  //     return !value || (value && value.type.startsWith("image/"));
  //   })
  //   .test("file-size", "La taille de l'image est trop grande", value => {
  //     return !value || (value && value.size <= 1000000);
  //   })
  //   .test("file-min-size", "La taille de l'image est trop petite", value => {
  //     return !value || (value && value.size >= 200000);
  //   }),
  email: Yup.string()
    .email("Adresse e-mail invalide")
    .required("Veuillez saisir votre adresse e-mail"),
  phoneNumber: Yup.number()
    .typeError("Le numéro de téléphone doit être un nombre.")
    .test("len", "Le numéro de téléphone doit avoir 10 chiffres.", val => {
      if (val) {
        return val.toString().length === 10;
      }
      return true;
    })
    .required("Veuillez saisir votre numéro de téléphone"),
  firstName: Yup.string().required("Veuillez saisir votre prénom"),
  lastName: Yup.string().required("Veuillez saisir votre nom de famille"),
  mainFunction: Yup.string().required("Veuillez saisir une fonction"),
  comment: Yup.string(),
  birthdayDate: Yup.date()
    .nullable()
    .max(new Date(), "Date invalide")
    .required("Veuillez saisir votre date de naissance"),
  address: Yup.string().required("Veuillez saisir votre adresse"),
});

const getUserData = async id => {
  const response = await api.get(`${httpsEndpoint}/user/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("id-token")}`,
    },
  });
  return response.data;
};

const EditUser = ({ open, setOpen, id }) => {
  if (id === "") return null;

  const { sasTokens } = useSelector(state => state.sasToken);

  const [initialUserValue, setInitialUserValue] = useState({
    userPhoto: "",
    firstName: "",
    lastName: "",
    email: "",
    mainFunction: "",
    subFunctions: [],
    phoneNumber: "",
    birthdayDate: "",
    address: "",
    comment: "",
    attachmentFiles: [{ fileDescription: "", file: {} }],
  });

  const [initialFiles, setInitialFiles] = useState([]);
  const [handleOpenSnackbar, setHandleOpenSnackbar] = useState({
    open: false,
    severity: "error",
    message: "",
  });

  const { data, isLoading, isError, refetch } = useQuery(
    ["userData", id],
    () => getUserData(id),
    {
      enabled: !!id,
    },
  );

  useEffect(() => {
    if (!isLoading) {
      setInitialUserValue({
        userPhoto: data.photoUrl
          ? `${data.photoUrl}?${sasTokens.fileStorage}`
          : "",
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mainFunction: {
          _id: data.mainFunction._id,
          functionName: data.mainFunction.functionName,
        },
        subFunctions:
          data.subFunctions === null
            ? []
            : data.subFunctions.map(subFunction => {
                return {
                  _id: subFunction._id,
                  functionName: subFunction.functionName,
                };
              }),
        phoneNumber: data.phoneNumber.slice(2),
        birthdayDate: formatToYYYYMMDD(data.birthdayDate),
        address: data.address,
        comment: data.comment,
        attachmentFiles:
          data.attachments.length !== 0
            ? data.attachments.map(attachment => {
                return {
                  fileDescription: attachment.fileDescription,
                  file: `${attachment.fileUrl}?${sasTokens.fileStorage}`,
                  ...attachment,
                };
              })
            : [{ fileDescription: "", file: {} }],
      });
      setInitialFiles(
        data.attachments
          ? data.attachments.map(attachment => {
              return {
                fileDescription: attachment.fileDescription,
                file: `${attachment.fileUrl}?${sasTokens.fileStorage}`,
                ...attachment,
              };
            })
          : [{ fileDescription: "", file: {} }],
      );
    }
  }, [data, isLoading]);

  const onSubmit = (values, actions) => {
    const { setFieldError, setSubmitting, setValues } = actions;
    const subFunctionsIds =
      values.subFunctions.length === 0
        ? []
        : values.subFunctions.map(fn => fn._id);

    const attachmentFiles = values.attachmentFiles;
    const formData = new FormData();
    formData.append("userPhoto", values.userPhoto);
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("email", values.email);
    formData.append("mainFunction", values.mainFunction);
    formData.append("subFunctions", `[${subFunctionsIds}]`);
    formData.append("phoneNumber", `+1${values.phoneNumber}`);
    formData.append("birthdayDate", values.birthdayDate);
    formData.append("address", values.address);
    formData.append("comment", values.comment);

    let deletedAttachments = [];
    let updatedAttachments = [];
    let addedAttachments = [];
    // Tarck delete attachments
    deletedAttachments = initialFiles.filter(
      initialFile =>
        !attachmentFiles.some(
          attachmentFiles => attachmentFiles._id === initialFile._id,
        ),
    );
    const deletedFiles = deletedAttachments.map(file => file.fileUrl);
    formData.append("deletedAttachments", `[${deletedFiles}]`);

    // Tarck added attachments
    addedAttachments = attachmentFiles.filter(
      file => !file.hasOwnProperty("_id"),
    );

    for (let i = 0; i < addedAttachments.length; i++) {
      formData.append(
        `fileDescription${i}`,
        addedAttachments[i].fileDescription,
      );
      formData.append(`attachment${i}`, addedAttachments[i].file);
    }

    // track updated attachments
    updatedAttachments = attachmentFiles.filter(file =>
      file.hasOwnProperty("_id"),
    );

    updatedAttachments = trackChanges(initialFiles, attachmentFiles);

    for (const key in updatedAttachments.updatedFileDescriptions) {
      formData.append(key, updatedAttachments.updatedFileDescriptions[key]);
    }

    for (const key in updatedAttachments.updatedAttachments) {
      formData.append(key, updatedAttachments.updatedAttachments[key]);
    }

    api
      .put(`${httpsEndpoint}/user/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("id-token")}`,
        },
      })
      .then(_ => {
        setHandleOpenSnackbar({
          open: true,
          severity: "success",
          message: "L'utilisateur a été mis à jour avec succès.",
        });

        setValues(initialValues);

        refetch();

        setOpen(false);
      })
      .catch(({ response }) => {
        const { error } = response.data;
        if (error === "Email address is already in use.") {
          setFieldError(
            "email",
            "L'adresse e-mail est déjà utilisée par un autre compte.",
          );
        } else if (error === "Phone number is already in use.") {
          setFieldError(
            "phoneNumber",
            "L'utilisateur avec le numéro de téléphone fourni existe déjà.",
          );
        } else {
          setHandleOpenSnackbar({
            open: true,
            severity: "error",
            message: "Quelque chose s'il vous plaît réessayer plus tard",
          });
        }
      })
      .finally(() => {
        setSubmitting(false);
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
        {isLoading ? (
          <Loading />
        ) : isError ? (
          <ErrorMessage />
        ) : (
          <Container sx={{ pb: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6" color="initial">
                Modifier Travailleur
              </Typography>
              <IconButton onClick={() => setOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Box>
              <Formik
                initialValues={initialUserValue || initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
                enableReinitialize
              >
                {({ isSubmitting, initialValues }) => {
                  const { userPhoto, attachmentFiles } = initialValues;
                  return (
                    <Form encType="multipart/form-data">
                      <Stack gap={1}>
                        <FormControl variant="standard">
                          <FileUpload
                            name="userPhoto"
                            accept={{ "image/*": [".png", ".jpeg", ".jpg"] }}
                            previewSize={150}
                            initialValue={userPhoto}
                          />
                        </FormControl>
                        <Stack flexDirection="row" gap={2}>
                          {/* first name */}
                          <FormControl variant="standard">
                            <InputLabel shrink htmlFor="firstName">
                              Prénom
                            </InputLabel>
                            <BSTextField
                              type="text"
                              placeholder="Prénom"
                              name="firstName"
                            />
                          </FormControl>
                          {/* last name */}
                          <FormControl variant="standard">
                            <InputLabel shrink htmlFor="lastName">
                              Nom
                            </InputLabel>
                            <BSTextField
                              type="text"
                              placeholder="Nom"
                              name="lastName"
                            />
                          </FormControl>
                        </Stack>

                        <Stack flexDirection="row" gap={2}>
                          {/* email */}
                          <FormControl variant="standard">
                            <InputLabel shrink htmlFor="email">
                              Addresse Mail
                            </InputLabel>
                            <BSTextField
                              name="email"
                              type="email"
                              placeholder="Email"
                            />
                          </FormControl>
                          {/* Phone number */}
                          <FormControl variant="standard">
                            <InputLabel shrink htmlFor="phoneNumber">
                              Numéro de téléphone
                              <Typography
                                component="span"
                                variant="body1"
                                color="error.main"
                              >
                                *
                              </Typography>
                            </InputLabel>
                            <BSTextField
                              type="tel"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  backgroundColor: "red",
                                },
                              }}
                              placeholder="Numéro de téléphone"
                              name="phoneNumber"
                              startAdornment={
                                <InputAdornment position="start">
                                  +1
                                </InputAdornment>
                              }
                            />
                          </FormControl>
                        </Stack>
                        <Stack flexDirection="row" gap={2}>
                          {/* Job title */}
                          <FormControl
                            variant="standard"
                            sx={{
                              width: "300px",
                            }}
                          >
                            <InputLabel shrink htmlFor="mainFunction">
                              Fonction Principale
                            </InputLabel>
                            <FSelectMenu name="mainFunction" />
                          </FormControl>
                          {/* Sub functions */}
                          <FormControl
                            sx={{
                              width: "300px",
                            }}
                            variant="standard"
                          >
                            <InputLabel shrink htmlFor="subFunctions">
                              Sous Fonction
                            </InputLabel>
                            <MFSelectMenu name="subFunctions" />
                          </FormControl>
                        </Stack>

                        <Stack flexDirection="row" gap={2}>
                          {/* Birthday date */}
                          <FormControl variant="standard">
                            <InputLabel shrink htmlFor="email">
                              Date de naissance
                            </InputLabel>
                            <BSTextField
                              type="date"
                              placeholder="Email"
                              name="birthdayDate"
                            />
                          </FormControl>
                          {/* Address */}
                          <FormControl variant="standard">
                            <InputLabel shrink htmlFor="address">
                              Address
                            </InputLabel>
                            <BSTextField
                              type="text"
                              placeholder="Suite 21A 1175 boulevard Charest Ouest. Québec,QC, G1N2C9"
                              name="address"
                            />
                          </FormControl>
                        </Stack>
                        <CostumBSFieldArray
                          name="attachmentFiles"
                          attachments={attachmentFiles}
                        />
                        {/* Comment */}
                        <FormControl variant="standard">
                          <InputLabel shrink htmlFor="comment">
                            Commentaire
                          </InputLabel>
                          <BSTextarea name="comment" />
                        </FormControl>
                        <LoadingButton
                          type="submit"
                          variant="contained"
                          size="medium"
                          fullWidth={true}
                          disabled={isSubmitting}
                          loading={isSubmitting}
                        >
                          Sauvegarder
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

export default EditUser;

EditUser.propTypes = {
  id: PropTypes.string.isRequired,
  setOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const trackChanges = (initialVersion, updatedVersion) => {
  const updatedFileDescriptions = {};
  const updatedAttachments = {};

  for (const updatedFile of updatedVersion) {
    const initialFile = initialVersion.find(
      file => file._id === updatedFile._id,
    );
    if (initialFile) {
      if (initialFile.fileDescription !== updatedFile.fileDescription) {
        updatedFileDescriptions[`updateFileDescription${updatedFile._id}`] =
          updatedFile.fileDescription;
      }
      if (initialFile.file !== updatedFile.file) {
        updatedAttachments[`updateAttachment${updatedFile._id}`] =
          updatedFile.file;
      }
    }
  }

  return {
    updatedFileDescriptions,
    updatedAttachments,
  };
};
