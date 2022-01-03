import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./AuthComponents/SignIn";
import SignUp from "./AuthComponents/SignUp";
import Home from "./CoreComponent/home";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/signin" element={<SignIn />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
