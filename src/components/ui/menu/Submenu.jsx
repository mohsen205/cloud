import React from "react";
import { SubMenu, menuClasses, useProSidebar } from "react-pro-sidebar";
import { Box, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const Submenu = ({ children, icon, label }) => {
  const { collapsed } = useProSidebar();
  const theme = useTheme();
  const { pathname } = useLocation();
  const [isActive, setIsActive] = useState(false);

  const links = children.map(child => {
    const { to } = child.props;
    return to;
  });

  useEffect(() => {
    setIsActive(links.includes(pathname));
  }, [pathname, links]);

  return (
    <SubMenu
      icon={icon}
      rootStyles={{
        ["." + menuClasses.button]: {
          fontFamily: "Roboto,Helvetica,Arial,sans-serif",
          "&:hover": {
            color: theme.palette.primary.light,
          },
        },
        [".ps-submenu-content"]: {
          borderRadius: collapsed ? theme.shape.borderRadius : 0,
          paddingTop: collapsed ? 10 : 5,
          paddingBottom: collapsed ? 10 : 5,
        },
      }}
      className={isActive && "active"}
      label={label}
    >
      <Box
        sx={{
          marginLeft: collapsed ? 2 : 5,
          marginRight: collapsed ? 2 : 5,
        }}
      >
        {children}
      </Box>
    </SubMenu>
  );
};

export default Submenu;

Submenu.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.node.isRequired,
  label: PropTypes.string,
};
