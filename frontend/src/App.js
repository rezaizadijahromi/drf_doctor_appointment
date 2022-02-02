import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import SignIn from "./AuthComponents/SignIn";
import SignUp from "./AuthComponents/SignUp";
import Home from "./CoreComponent/home";
import SlotList from "./CoreComponent/slotsList";
import Navbar from "./StyleComponent/Navbar";
import Profile from "./CoreComponent/Profile";
import UserList from "./CoreComponent/userList";
import { unstable_createMuiStrictModeTheme } from "@mui/material";
import AddRoom from "./CoreComponent/AddRoom";
import AddSlot from "./CoreComponent/AddSlot";
import SlotManagment from "./CoreComponent/SlotManagment";

function App() {
	const theme = unstable_createMuiStrictModeTheme();
	return (
		<ThemeProvider theme={theme}>
			<div className="App">
				<Router>
					<Navbar />
					<Routes>
						<Route path="/" element={<Home />}></Route>
						<Route path="/signin" element={<SignIn />}></Route>
						<Route path="/signup" element={<SignUp />}></Route>
						<Route path="/profile" element={<Profile />}></Route>
						<Route path="/addRoom" element={<AddRoom />}></Route>
						<Route path="/userList" element={<UserList />}></Route>
						<Route path="/:idRoute/addSlot" element={<AddSlot />}></Route>
						<Route path="/room/:id" element={<SlotList />}></Route>
						<Route
							path="/room/:idRoute/managment/"
							element={<SlotManagment />}
						></Route>
					</Routes>
				</Router>
			</div>
		</ThemeProvider>
	);
}

export default App;
