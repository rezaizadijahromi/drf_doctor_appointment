import axios from "axios";
import React, { useState, useEffect } from "react";
import { apiConfig } from "../config";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import Message from "../Component/Message";
import Loader from "../Component/Loader";
import "./profile.css";

const UserList = () => {
	let [users, setUsers] = useState([
		{
			results: {
				username: "",
				id: "1",
				profile: {
					username: "username",
					id: "1",
				},
				email: "email@gmail.com",
				isAdmin: false,
			},
		},
	]);
	// var users = [
	// 	{
	// 		results: {
	// 			profile: {
	// 				username: "",
	// 				id: "",
	// 			},
	// 			email: "",
	// 			isAdmin: false,
	// 		},
	// 	},
	// ];
	const userList = async () => {
		const userLocal = JSON.parse(localStorage.getItem("userInfo"));

		if (userLocal) {
			const config = {
				headers: {
					Authorization: `Bearer ${userLocal.data.access}`,
				},
			};

			const response = await axios.get(`${apiConfig.baseUrl}/users/`, config);

			if (response.data) {
				setUsers(response.data.results);
				// for (let index = 0; index < response.data.results.length; index++) {
				// 	// console.log(response.data.results[index]);
				// }
			}
		}
	};

	useEffect(() => {
		userList();
	}, []);

	users.map((user) => {
		console.log(user.email);
	});

	const deleteHandler = (id) => {
		if (window.confirm("Are you sure?")) {
		}
	};

	return (
		<>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>Dessert (100g serving)</TableCell>
							<TableCell align="right">Calories</TableCell>
							<TableCell align="right">Fat&nbsp;(g)</TableCell>
							<TableCell align="right">Carbs&nbsp;(g)</TableCell>
							<TableCell align="right">Protein&nbsp;(g)</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{users.map((user) => (
							<TableRow
								key={user.id}
								sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
							>
								<TableCell component="th" scope="row">
									{user.username}
								</TableCell>
								<TableCell align="right">{user.username}</TableCell>
								<TableCell align="right">{user.username}</TableCell>
								<TableCell align="right">{user.username}</TableCell>
								<TableCell align="right">{user.username}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
};

export default UserList;
