import { Container } from "@mui/material";
import React from "react";
import { HeaderTitle } from "../../components/ui/content";
import { BSTabs } from "../../components/ui/navbar";
import { DisplayData } from "../../components/custom-ui/archive";

const components = [
  {
    label: "Travailleur",
    componentName: "user-archive",
    component: <DisplayData archiveType="user" />,
  },
  {
    label: "Shift",
    componentName: "shift-archive",
    component: <DisplayData archiveType="shift" />,
  },
  {
    label: "Client",
    componentName: "client-archive",
    component: <DisplayData archiveType="client" />,
  },
];

const Archive = () => {
  return (
    <Container>
      <HeaderTitle title="Archive" />
      <BSTabs pages={components} />
    </Container>
  );
};

export default Archive;
