import { createGenerateClassName } from "@mui/styles";

const theme = createGenerateClassName({
  typography: {},
  palette: {
    primary: {
      light: "#4f83cc",
      main: "#01579b",
      dark: "#002f6c",
      contrastText: "#fff",
    },
    secondary: {
      light: "#9fffe0",
      main: "#69f0ae",
      dark: "#2bbd7e",
      contrastText: "#000",
    },
    type: "light",
  },
});

export default theme;
