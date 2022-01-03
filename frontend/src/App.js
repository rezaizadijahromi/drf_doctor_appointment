import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./AuthComponents/SignIn";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
