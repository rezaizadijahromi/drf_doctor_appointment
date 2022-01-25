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
	let [users, setUsers] = useState([
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
	]);

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
			}
		}
	};

	useEffect(() => {
		const usersData = userList();
	}, []);

	console.log("users", users);
	const deleteHandler = (id) => {
		if (window.confirm("Are you sure?")) {
		}
	};

	return <></>;
};

export default UserList;
