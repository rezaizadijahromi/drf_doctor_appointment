import axios from "axios";
import React, { useState, useEffect } from "react";
import { apiConfig } from "../config";
import { Table } from "react-bootstrap";
import { Button, Input } from "@mui/material";
import { makeStyles } from "@mui/styles";

import Message from "../Component/Message";
import Loader from "../Component/Loader";
import "./profile.css";

const UserList = () => {
	// const [users, setUsers] = useState([
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
	// ]);
	var users = [
		{
			results: {
				profile: {
					username: "",
					id: "",
				},
				email: "",
				isAdmin: false,
			},
		},
	];
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
				console.log();
				for (let index = 0; index < response.data.results.length; index++) {
					// console.log(response.data.results[index]);
					users.push({
						results: {
							profile: {
								id: response.data.results[index].profile.id,
								username: response.data.results[index].profile.username,
							},
							email: response.data.results[index].email,
							isAdmin: response.data.results[index].is_superuser,
						},
					});
				}
				return users;
			}
		}
	};

	console.log(userList());
	useEffect(() => {
		const usersData = userList().then((data) => {
			console.log(data);
		});
	}, []);

	// for (let index = 0; index < users.length; index++) {
	// 	console.log(users[index].is_superuser);
	// }

	const deleteHandler = (id) => {
		if (window.confirm("Are you sure?")) {
		}
	};

	return (
		<>
			<h1> Users </h1>
			<Table striped bordered hover responsive className="table-sm">
				<thead>
					<tr>
						<th>ID</th>
						<th>NAME</th>
						<th>EMAIL</th>
						<th>ADMIN</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{users.map((user) => (
						<tr key={user.results.profile.id}>
							<td>{user.results.profile.id}</td>
							<td>{user.results.profile.username}</td>
							<td>
								<a href={`mailto:${user.results.email}`}>
									{user.results.email}
								</a>
							</td>
							<td>
								{user.results.isAdmin ? (
									<i
										className="fas fa-check"
										style={{
											color: "green",
										}}
									></i>
								) : (
									<i className="fas fa-times" style={{ color: "red" }}></i>
								)}
							</td>
							<td>
								<Button variant="light" className="btn-sm">
									<i className="fas fa-edit"></i>
								</Button>
								<Button
									variant="danger"
									className="btn-sm"
									onClick={() => deleteHandler(user._id)}
								>
									<i className="fas fa-trash"></i>
								</Button>
							</td>
						</tr>
					))}
				</tbody>
			</Table>
		</>
	);
};

export default UserList;
