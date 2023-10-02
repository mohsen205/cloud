import { createTheme } from "@mui/material/styles";
import { frFR } from "@mui/material/locale";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1A938C",
    },
    secondary: {
      main: "#3A9BA4",
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    button: {
      textTransform: "capitalize",
    },
  },
  frFR,
});

export default theme;
