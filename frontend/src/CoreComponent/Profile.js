import axios from "axios";
import React, { useState, useEffect } from "react";
import { apiConfig } from "../config";
import { Form } from "react-bootstrap";
import { Button, Input } from "@mui/material";
import { makeStyles } from "@mui/styles";

import Message from "../Component/Message";
import Loader from "../Component/Loader";
import "./profile.css";
import { CardMedia } from "@mui/material";
import { height, style } from "@mui/system";

function sleep(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

const useStyles = makeStyles((theme) => ({
	submit: {
		marginTop: 10,
		right: "10%",
		marginBottom: theme.spacing(2),
		width: 200,
	},
	updateButton: {
		width: 200,
		marginRight: 30,
		textAlign: "center",
	},
	buttons: {
		width: 165,
		height: 45,
	},
	alignment: {
		textAlign: "center",
	},
	imagContainer: {
		height: 300,
		width: 350,
		border: "1px solid #808080",
	},
}));

const Profile = () => {
	const classes = useStyles();

	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("********");
	const [confirmPassword, setConfirmPassword] = useState("********");
	const [image, setImage] = useState("");

	const [message, setMessage] = useState("");
	const [messageVarient, setMessageVarient] = useState("info");
	const [load, setLoad] = useState(false);

	const profileData = async () => {
		const userLocal = JSON.parse(localStorage.getItem("userInfo"));

		if (userLocal) {
			const config = {
				headers: {
					Authorization: `Bearer ${userLocal.data.access}`,
				},
			};

			const response = await axios.get(
				`${apiConfig.baseUrl}/users/profile`,
				config
			);

			console.log(response.data);
			setLoad(true);
			await sleep(500);
			if (response.data) {
				setLoad(false);
				setUsername(response.data.username);
				setEmail(response.data.email);
				setImage(response.data.profile.profile_pic);
				// Todo Need to add notification
			} else {
				setMessage(response.data.message);
				setMessageVarient("error");
				// pop up error messages
			}
		}
	};

	const changeEmail = async () => {
		const userLocal = JSON.parse(localStorage.getItem("userInfo"));

		if (userLocal) {
			const config = {
				headers: {
					Authorization: `Bearer ${userLocal.data.access}`,
				},
			};

			const response = await axios.patch(
				`${apiConfig.baseUrl}/users/profile/`,
				{ email: email },
				config
			);

			setLoad(true);
			await sleep(500);

			if (response.data.status === "success") {
				await sleep(500);
				setLoad(false);
				setMessage(response.data.message);
				setMessageVarient("success");
				setEmail(response.data.updated_email);
			} else {
				setLoad(false);
				setMessage(response.data.message);
				setMessageVarient("error");
				console.log(response.data.message);
			}
		}
	};

	const changePassword = async () => {
		const userLocal = JSON.parse(localStorage.getItem("userInfo"));

		if (userLocal) {
			const config = {
				headers: {
					Authorization: `Bearer ${userLocal.data.access}`,
				},
			};

			const response = await axios.post(
				`${apiConfig.baseUrl}/users/profile/`,
				{ new_password: password, new_password_confirm: confirmPassword },
				config
			);

			setLoad(true);
			await sleep(500);

			if (response.data.status === "success") {
				await sleep(500);
				setLoad(false);
				setMessage(response.data.message);
				setMessageVarient("success");
			} else {
				setLoad(false);
				setMessage(response.data.message);
				setMessageVarient("error");
				console.log(response.data.message);
			}
		}
	};

	const profilePicChange = async (e) => {
		const userLocal = JSON.parse(localStorage.getItem("userInfo"));

		const file = e.target.files[0];
		const formData = new FormData();
		formData.append("profile_pic", file);

		console.log(image);
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${userLocal.data.access}`,
					"Content-Type": "multipart/form-data",
				},
			};

			const response = await axios.patch(
				`${apiConfig.baseUrl}/users/profile_update/photo/`,
				formData,
				config
			);

			if (response.data) {
				setImage(response.data.profile_pic);
				profileData();
				setLoad(false);
				setMessage(response.data.message);
				setMessageVarient("success");
			} else {
				setLoad(false);
				setMessage(response.data.message);
				setMessageVarient("error");
			}
		} catch (error) {
			console.log(error);
		}
	};

	console.log(image);

	const deleteProfilePicture = async () => {
		const userLocal = JSON.parse(localStorage.getItem("userInfo"));

		const config = {
			headers: {
				Authorization: `Bearer ${userLocal.data.access}`,
			},
		};

		const response = await axios.delete(
			`${apiConfig.baseUrl}/users/profile_update/photo/`,
			config
		);

		console.log(response.data);

		if (response.data) {
			profileData();
			setMessage(response.data.message);
			setMessageVarient("info");
		} else {
			setMessage(response.data.message);
			setMessageVarient("error");
		}
	};

	useEffect(() => {
		profileData();
	}, []);

	return (
		<>
			{message && <Message variant={messageVarient}>{message}</Message>}

			{load ? (
				<Loader />
			) : (
				<div className="userInformation">
					<div className="top-text">User Information:</div>

					<div className="half-div">
						<div className="information">
							<div className="info">Username</div>
							<Form.Control
								className="intext"
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							></Form.Control>

							<div className="info">Email</div>
							<Form.Control
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							></Form.Control>

							<div className="info">Password</div>
							<Form.Control
								className="intext"
								type="text"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							></Form.Control>

							<div className="info">Confirm your password</div>
							<Form.Control
								className="intext"
								type="text"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							></Form.Control>

							<div className={classes.alignment}>
								<Button
									color="primary"
									variant="contained"
									onClick={changeEmail}
									className={classes.updateButton}
								>
									Update
								</Button>
							</div>
						</div>

						<div className="forimg">
							<CardMedia
								style={{ objectFit: "contain", height: 350, width: 350 }}
								component="img"
								src={image}
							></CardMedia>

							<label htmlFor="contained-button-file">
								<Button
									style={{
										marginTop: 10,
										right: "20%",
										width: 200,
									}}
									component="span"
									variant="contained"
									onChange={profilePicChange}
								>
									<Input
										accept="image/*"
										id="contained-button-file"
										multiple
										type="file"
										hidden
										style={{ display: "none" }}
									/>
									upload
								</Button>
							</label>

							<Button
								style={{
									marginTop: 10,
									right: "20%",
									width: 200,
									display: "block",
									textAlign: "center",
								}}
								color="warning"
								component="span"
								variant="contained"
								onClick={deleteProfilePicture}
							>
								Delete
							</Button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Profile;
