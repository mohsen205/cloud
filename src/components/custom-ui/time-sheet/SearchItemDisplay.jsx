import React from "react";
import {
  ListItemText,
  ListItemAvatar,
  Avatar,
  ListItemButton,
  useTheme,
} from "@mui/material";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const SearchItemDisplay = ({ user, selectedUserDetails, onUserSelect }) => {
  const theme = useTheme();
  const { sasTokens } = useSelector(state => state.sasToken);

  const toggleSelected = (id, userName) => {
    onUserSelect({
      id,
      userName,
    });
  };

  const emailDisplay =
    user.email.length >= 30 ? `${user.email.slice(0, 30)}...` : user.email;

  return (
    <ListItemButton
      disableTouchRipple
      alignItems="flex-start"
      onClick={() => toggleSelected(user._id, user.displayName)}
      dense={false}
      sx={{
        borderRadius: `${theme.shape.borderRadius}px`,
        paddingY: 0,
      }}
      selected={selectedUserDetails?.id === user._id}
    >
      <ListItemAvatar>
        <Avatar
          alt={user.displayName}
          src={`${user.photoUrl}?${sasTokens.fileStorage}`}
        />
      </ListItemAvatar>
      <ListItemText primary={user.displayName} secondary={emailDisplay} />
    </ListItemButton>
  );
};

export default SearchItemDisplay;

SearchItemDisplay.propTypes = {
  user: PropTypes.object.isRequired,
  selectedUserDetails: PropTypes.object.isRequired,
  onUserSelect: PropTypes.func.isRequired,
};
