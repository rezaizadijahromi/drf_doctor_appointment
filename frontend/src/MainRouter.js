import { BrowserRouter, Route } from "react-router-dom";

import SignIn from "./AuthComponents/SignIn";

const MainRouter = () => {
  return (
    <div>
      <BrowserRouter>
        <Route exact path="/"></Route>

        <Route path="/signin/" component={SignIn} />
      </BrowserRouter>
    </div>
  );
};

export default MainRouter;
