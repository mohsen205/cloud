import React, { useState } from "react";
import PropTypes from "prop-types";
import { Tabs, Tab, Box, styled } from "@mui/material";

export const NavTabs = styled(Tabs)({
  "& .MuiTabs-indicator": {
    display: "none",
  },
  "& .Mui-selected": {
    "&::after": {
      content: '""',
      display: "block",
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100%",
      borderBottom: `2px solid #1890ff`,
      transition: "transform 0.3s ease-in-out",
      transform: "scaleX(0)",
      transformOrigin: "center",
    },
  },
  "& .Mui-selected.MuiTabs-scroller": {
    "&::after": {
      transform: "scaleX(1)",
    },
  },
});

export const NavTab = styled(props => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    "&.Mui-selected": {
      color: theme.palette.common.white,
      backgroundColor: theme.palette.primary.main,
      borderRadius: theme.shape.borderRadius,
    },
  }),
);

export const Nav = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  borderRadius: theme.shape.borderRadius,
  width: "fit-content",
}));

const TabPanel = props => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`bs-tabpanel-${index}`}
      aria-labelledby={`bs-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const a11yProps = index => {
  return {
    id: `bs-tab-${index}`,
    "aria-controls": `bs-tabpanel-${index}`,
  };
};

const BSTabs = ({ pages }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Nav>
        <NavTabs value={value} onChange={handleChange} aria-label="nav tabs">
          {pages.map((component, index) => {
            return (
              <NavTab
                key={component.componentName}
                label={component.label}
                {...a11yProps(index)}
              />
            );
          })}
        </NavTabs>
      </Nav>
      {pages.map((component, index) => {
        return (
          <TabPanel key={component.componentName} value={value} index={index}>
            {component.component}
          </TabPanel>
        );
      })}
    </Box>
  );
};

export default BSTabs;

BSTabs.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.object).isRequired,
};
