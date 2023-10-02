import React from "react";
import { IconButton, Typography, Box } from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const FileManagement = ({ attachments }) => {
  const { sasTokens } = useSelector(state => state.sasToken);

  return (
    <>
      <Typography variant="h6" color="initial">
        Dossier de l&apos;employé
      </Typography>
      <Typography
        variant="subtitle1"
        color="initial"
        style={{ marginBottom: "10px" }}
      >
        Pièces jointes
      </Typography>
      <Box>
        {attachments.length === 0 ? (
          <Typography variant="subtitle2">
            Aucun fichier disponible pour cet employé.
          </Typography>
        ) : (
          attachments.map(attachment => (
            <Box
              key={attachment._id}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              marginBottom="5px"
              padding="5px"
              border="1px solid #ccc"
              borderRadius="10px"
            >
              <Typography variant="subtitle2">
                {attachment.fileDescription}
              </Typography>
              <IconButton
                color="primary"
                href={`${attachment.fileUrl}?${sasTokens.fileStorage}`}
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileDownloadOutlinedIcon />
              </IconButton>
            </Box>
          ))
        )}
      </Box>
    </>
  );
};

export default FileManagement;

FileManagement.propTypes = {
  attachments: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      fileDescription: PropTypes.string.isRequired,
      fileUrl: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
