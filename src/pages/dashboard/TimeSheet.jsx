import React, { useState } from "react";
import { Button, Container, Stack } from "@mui/material";
import { HeaderTitle } from "../../components/ui/content";
import {
  SearchSidebar,
  ClockInRecordsDisplay,
  TimeSheetGeneratorMenu,
} from "../../components/custom-ui/time-sheet";

const TimeSheet = () => {
  const [selectedUserDetails, setSelectedUserDetails] = useState({
    id: "",
    userName: "",
  });

  const [isTimeSheetGenerationOpen, setIsTimeSheetGenerationOpen] =
    useState(false);

  return (
    <>
      <Container>
        <HeaderTitle title="Historique de Travail">
          <Button
            variant="contained"
            onClick={() => setIsTimeSheetGenerationOpen(true)}
            disabled={!selectedUserDetails.id}
          >
            Feuille de Temps
          </Button>
        </HeaderTitle>
        <Container sx={{ marginTop: 1 }}>
          <Stack direction="row" gap={2}>
            <SearchSidebar
              selectedUserDetails={selectedUserDetails}
              onUserSelect={setSelectedUserDetails}
            />
            <ClockInRecordsDisplay selectedUserDetails={selectedUserDetails} />
          </Stack>
        </Container>
      </Container>
      <TimeSheetGeneratorMenu
        open={isTimeSheetGenerationOpen}
        setOpen={setIsTimeSheetGenerationOpen}
        id={selectedUserDetails.id}
        userName={selectedUserDetails.userName}
      />
    </>
  );
};

export default TimeSheet;
