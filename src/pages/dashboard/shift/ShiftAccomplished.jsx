import React from "react";
import { Container } from "@mui/material";
import { HeaderTitle } from "../../../components/ui/content";
import { AccomplishedShiftTable } from "../../../components/custom-ui/shift/accomplished";

const ShiftAccomplished = () => {
  return (
    <Container>
      <HeaderTitle title="Liste de shift aboutie" />
      <Container sx={{ marginTop: 1 }}>
        <AccomplishedShiftTable />
      </Container>
    </Container>
  );
};

export default ShiftAccomplished;
