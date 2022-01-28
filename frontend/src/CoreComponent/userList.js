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
import { Button } from "@mui/material";

import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";

function sleep(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

const useStyles = makeStyles((theme) => ({
	table: {
		marginTop: 50,
	},
	rowColor: { color: "#d3d3d3", backgroundColor: "#d3d3d3" },
	rowColor2: { color: "#a9a9a9", backgroundColor: "#a9a9a9" },
}));

const UserList = () => {
	const classes = useStyles();
	let navigate = useNavigate();

	const [message, setMessage] = useState("");
	const [messageVarient, setMessageVarient] = useState("info");
	const [load, setLoad] = useState(false);

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
				is_superuser: false,
			},
		},
	]);

	const userList = async () => {
		const userLocal = JSON.parse(localStorage.getItem("userInfo"));

		if (userLocal && (userLocal.data.is_superuser || userLocal.data.is_staff)) {
			const config = {
				headers: {
					Authorization: `Bearer ${userLocal.data.access}`,
				},
			};

			const response = await axios.get(`${apiConfig.baseUrl}/users/`, config);

			setLoad(true);
			await sleep(500);

			if (response.data) {
				setUsers(response.data.results);
				setLoad(false);
			} else {
				setMessage(response.data.message);
				setMessageVarient("error");
			}
		} else {
			navigate("/");
		}
	};

	useEffect(() => {
		userList();
	}, []);

	// users.map((user) => {
	// 	console.log(user.is_superuser);
	// });

	const deleteHandler = async (id) => {
		const userLocal = JSON.parse(localStorage.getItem("userInfo"));
		console.log(userLocal);

		if (userLocal) {
			const config = {
				headers: {
					Authorization: `Bearer ${userLocal.data.access}`,
				},
			};

			if (window.confirm("Are you sure?")) {
				const response = await axios.delete(
					`${apiConfig.baseUrl}/users/delete/${id}/`,
					config
				);
				if (response.data.status === "success") {
					setMessage(response.data.message);
					setMessageVarient("info");
					userList();
				} else {
					setMessage(response.data.message);
					setMessageVarient("error");
					setLoad(false);
				}
			}
		}
	};

	return (
		<>
			{message && <Message variant={messageVarient}>{message}</Message>}

			{load ? (
				<Loader />
			) : (
				<TableContainer component={Paper} className={classes.table}>
					<Table
						sx={{ minWidth: 650, height: "100%" }}
						aria-label="simple table"
					>
						<TableHead>
							<TableRow>
								<TableCell className={classes.rowColor}>ID</TableCell>
								<TableCell className={classes.rowColor2} align="center">
									EMAIL
								</TableCell>
								<TableCell className={classes.rowColor} align="center">
									USERNAME
								</TableCell>
								<TableCell className={classes.rowColor2} align="center">
									ISADMIN
								</TableCell>
								<TableCell
									className={classes.rowColor}
									align="center"
								></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{users.map((user) => (
								<TableRow
									className={classes.rowColor2}
									key={user.id}
									sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
								>
									<TableCell
										className={classes.rowColor}
										component="th"
										scope="row"
									>
										{user.id}
									</TableCell>
									<TableCell className={classes.rowColor2} align="center">
										{user.email}
									</TableCell>
									<TableCell className={classes.rowColor} align="center">
										{user.username}
									</TableCell>
									<TableCell className={classes.rowColor2} align="center">
										{user.is_superuser ? "True" : "False"}
									</TableCell>
									<TableCell className={classes.rowColor} align="center">
										<Button
											color="error"
											variant="contained"
											onClick={() => deleteHandler(user.id)}
										>
											DELETE
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</>
	);
};

export default UserList;
