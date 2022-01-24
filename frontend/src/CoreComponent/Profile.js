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
import { textAlign } from "@mui/system";

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
}));

const Profile = () => {
	const classes = useStyles();

	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("********");
	const [image, setImage] = useState("");

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

			if (response.data) {
				setUsername(response.data.username);
				setEmail(response.data.email);
				setImage(response.data.profile.profile_pic);
				// Todo Need to add notification
			} else {
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

			if (response.data.success) {
				console.log(response.data);
				setEmail(response.data.updated_email);
			} else {
				console.log(response.data.message);
			}
		}
	};

	const profilePicChange = async (e) => {
		const userLocal = JSON.parse(localStorage.getItem("userInfo"));

		const file = e.target.files[0];
		const formData = new FormData();
		formData.append("profile_pic", file);
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

			// setImage(response.data);
			console.log(response.data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		profileData();
	}, []);

	return (
		<>
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
						<CardMedia component="img" src={image}></CardMedia>

						<label htmlFor="contained-button-file">
							<Button
								style={{
									marginTop: 10,
									right: "10%",
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
					</div>
				</div>
			</div>
		</>
	);
};

export default Profile;
