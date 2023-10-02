import React from "react";
import PropTypes from "prop-types";
import { UserArchiveList, ClientArchivedList, ShiftArchivedList } from "./";
import NotFound from "../../../pages/NotFound";

const DisplayData = ({ archiveType }) => {
  if (archiveType === "client") {
    return <ClientArchivedList />;
  }

  if (archiveType === "user") {
    return <UserArchiveList />;
  }

  if (archiveType === "shift") {
    return <ShiftArchivedList />;
  }

  return <NotFound />;
};

export default DisplayData;

DisplayData.propTypes = {
  archiveType: PropTypes.string.isRequired,
};
