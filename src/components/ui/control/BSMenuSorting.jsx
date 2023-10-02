import React, { useState } from "react";
import {
  IconButton,
  Button,
  Menu,
  Box,
  useTheme,
  Radio,
  RadioGroup,
  FormControlLabel,
  Stack,
} from "@mui/material";
import SwapVertOutlinedIcon from "@mui/icons-material/SwapVertOutlined";
import NorthOutlinedIcon from "@mui/icons-material/NorthOutlined";
import SouthOutlinedIcon from "@mui/icons-material/SouthOutlined";
import SortOutlinedIcon from "@mui/icons-material/SortOutlined";
import PropTypes from "prop-types";

const BSMenuSorting = ({ list, setSortBy }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [value, setValue] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState(0);

  const handleRadioChange = event => {
    const newValue = event.target.value;
    if (value === newValue) {
      setSortDirection(prevDirection => (prevDirection === 1 ? -1 : 1));
    } else {
      setValue(newValue);
      setSortDirection(1);
    }
  };

  const handleUpDownMenu = () => {
    setSortDirection(prevDirection => {
      if (prevDirection === 1) return -1;
      if (prevDirection === -1) return 0;
      return 1;
    });
  };

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleApply = () => {
    if (sortDirection === 0) {
      setSortBy({
        field: "createdAt",
        order: -1,
      });
    } else {
      setSortBy({
        field: value,
        order: sortDirection,
      });
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <IconButton
        sx={{
          borderRadius: `${theme.shape.borderRadius}px`,
          border: "1px solid rgba(0, 0, 0, 0.23)",
        }}
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <SortOutlinedIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Box sx={{ paddingX: "10px" }}>
          <RadioGroup aria-label="position">
            {list.map(element => (
              <Stack
                key={element.value}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  padding: "5px 5px",
                }}
              >
                <FormControlLabel
                  value={element.value}
                  onChange={handleRadioChange}
                  control={
                    <Radio size="small" checked={element.value === value} />
                  }
                  label={element.label}
                  labelPlacement="end"
                />
                {value === element.value ? (
                  <IconButton
                    disabled={value !== element.value}
                    onClick={handleUpDownMenu}
                  >
                    {sortDirection === 1 && <NorthOutlinedIcon />}
                    {sortDirection === -1 && <SouthOutlinedIcon />}
                    {sortDirection === 0 && <SwapVertOutlinedIcon />}
                  </IconButton>
                ) : (
                  <IconButton
                    disabled={value !== element.value}
                    onClick={handleUpDownMenu}
                  >
                    <SwapVertOutlinedIcon />
                  </IconButton>
                )}
              </Stack>
            ))}
          </RadioGroup>
        </Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button variant="text" size="small" onClick={handleClose}>
            Annuler
          </Button>
          <Button
            variant="contained"
            sx={{ marginRight: "10px" }}
            size="small"
            onClick={handleApply}
          >
            Appliquer
          </Button>
        </Stack>
      </Menu>
    </Box>
  );
};

export default BSMenuSorting;

BSMenuSorting.propTypes = {
  list: PropTypes.array.isRequired,
  setSortBy: PropTypes.func.isRequired,
};
