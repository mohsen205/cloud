import React from "react";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import { FieldArray } from "formik";
import { IconButton, Box, Stack } from "@mui/material";
import PropTypes from "prop-types";
import { BSFileUpload, BSTextField } from "./";

const BSFieldArray = ({ name }) => {
  return (
    <FieldArray name={name}>
      {fieldArrayProps => {
        const { push, remove, form } = fieldArrayProps;
        const { attachmentFiles } = form.values;
        return (
          <Box>
            {attachmentFiles.map((_, index) => {
              return (
                <Stack direction="row" key={index} gap={1} mb={1}>
                  <BSTextField
                    placeholder="Nom de la pièce jointe"
                    type="text"
                    name={`attachmentFiles[${index}].fileDescription`}
                  />

                  <BSFileUpload name={`attachmentFiles[${index}].file`} />
                  <Stack direction="row">
                    <IconButton
                      onClick={() => remove(index)}
                      disabled={attachmentFiles.length > 1 ? false : true}
                    >
                      <RemoveCircleOutlineOutlinedIcon />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        push({
                          fileDescription: "",
                          file: {},
                        })
                      }
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
  );
};

export default BSFieldArray;

BSFieldArray.propTypes = {
  name: PropTypes.string.isRequired,
};
