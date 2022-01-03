import MainRouter from "./MainRouter";
import { BrowserRouter } from "react-router-dom";
import { hot } from "react-hot-loader";
import { ThemeProvider } from "@material-ui/styles";
import theme from "./them";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <MainRouter />
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default hot(module)(App);
