import React from "react";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { IconButton, Box, InputLabel, Stack, Divider } from "@mui/material";
import { FieldArray } from "formik";
import PropTypes from "prop-types";
import { BSFieldArray, BSFileUpload, BSTextField } from "../";

const CostumBSFieldArray = ({ name, attachments }) => {
  const checkArray = array => {
    if (Array.isArray(array) && array.length === 1) {
      const element = array[0];
      if (
        element.fileDescription === "" &&
        Object.keys(element.file).length === 0
      ) {
        return true;
      }
    }
    return false;
  };

  if (checkArray(attachments)) {
    return (
      <>
        <InputLabel shrink htmlFor={name}>
          Fichier joint
        </InputLabel>
        <BSFieldArray name={name} />
      </>
    );
  }
  return (
    <>
      <InputLabel shrink htmlFor={name}>
        Fichier joint
      </InputLabel>
      <FieldArray name={name}>
        {fieldArrayProps => {
          const { push, remove, form } = fieldArrayProps;
          const { attachmentFiles } = form.values;
          return (
            <Box>
              {attachmentFiles.map((attachmentFile, index) => {
                return (
                  <Stack direction="row" key={index} gap={0.7} mb={1}>
                    <Divider />
                    <BSTextField
                      placeholder="Nom de la pièce jointe"
                      type="text"
                      name={`attachmentFiles[${index}].fileDescription`}
                    />

                    <BSFileUpload
                      isUpdateMode={
                        typeof attachmentFile.file === "string" &&
                        attachmentFile.file.trim() !== ""
                      }
                      existingFileUrl={attachmentFile.file}
                      name={`attachmentFiles[${index}].file`}
                      customClass={
                        typeof attachmentFile.file === "string" &&
                        attachmentFile.file.trim() !== ""
                          ? "custom-dropzone"
                          : ""
                      }
                    />

                    <Stack direction="row">
                      {typeof attachmentFile.file === "string" &&
                        attachmentFile.file.trim() !== "" && (
                          <IconButton
                            onClick={() => window.open(attachmentFile.file)}
                          >
                            <DownloadOutlinedIcon color="primary" />
                          </IconButton>
                        )}
                      <IconButton
                        onClick={() => remove(index)}
                        disabled={attachmentFiles.length > 1 ? false : true}
                      >
                        <RemoveCircleOutlineOutlinedIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => push({ fileDescription: "", file: {} })}
                      >
                        <AddCircleOutlineOutlinedIcon />
                      </IconButton>
                    </Stack>
                  </Stack>
                );
              })}
            </Box>
          );
        }}
      </FieldArray>
    </>
  );
};

export default CostumBSFieldArray;

CostumBSFieldArray.propTypes = {
  name: PropTypes.string.isRequired,
  attachments: PropTypes.arrayOf(PropTypes.object),
};
