import axios from "axios";
import React, { useState, useEffect } from "react";
import { apiConfig } from "../config";
import { Form } from "react-bootstrap";
import { Button, Input } from "@mui/material";
import { makeStyles } from "@mui/styles";

import Message from "../Component/Message";
import Loader from "../Component/Loader";
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
	userInformation: {
		border: "1px solid black",
		borderRadius: "20px",
		margin: "5% 5%",
		padding: "20px",
		direction: "rtl",
	},
	textInput: {
		direction: "rtl",
		display: "inline-block",
		border: 0,
		/* border-bottom: 1px solid #333 */
		// width: "150px",
		height: "50px",
		fontSize: "10px",
		color: "#333",
		borderRadius: "10px",
		boxShadow: "0 1px 5px rgba(0, 0, 0, 0.2)",
		padding: "20px",
		margin: "5px 0 15px 0",
		width: "100%",
	},
	emailInput: {
		direction: "rtl",
		display: "inline-block",
		border: 0,
		/* border-bottom: 1px solid #333 */
		// width: "150px",
		height: "50px",
		fontSize: "10px",
		color: "#333",
		borderRadius: "10px",
		boxShadow: "0 1px 5px rgba(0, 0, 0, 0.2)",
		padding: "20px",
		margin: "5px 0 15px 0",
		width: "100%",
	},
	passwordInput: {
		direction: "rtl",
		display: "inline-block",
		border: 0,
		/* border-bottom: 1px solid #333 */
		// width: "150px",
		height: "50px",
		fontSize: "10px",
		color: "#333",
		borderRadius: "10px",
		boxShadow: "0 1px 5px rgba(0, 0, 0, 0.2)",
		padding: "20px",
		margin: "5px 0 15px 0",
		width: "100%",
	},
	topText: {
		textAlign: "right",
		fontSize: "22px",
		fontWeight: "bold",
	},
	halfDiv: {
		display: "flex",
		justifyContent: "center",
	},
	info: {
		fontFamily: "IRANSans",
		fontWeight: "bold",
		fontSize: "16px",
		textAlign: "center",
	},
	inText: {
		fontFamily: "IRANSans",
		width: "90%",
		display: "block",
	},
	forImage: {
		width: "35%",
		margin: "15px",
		marginTop: "50px",
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
		}
	};


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
				<div className={classes.userInformation}>
					<div className={classes.topText}>User Information:</div>

					<div className={classes.halfDiv}>
						<div
							style={{
								width: "70%",
								borderLeft: "dotted 1px #808080",
								margin: "20px",
								padding: "10px",
							}}
						>
							<div className={classes.topText}>
								<div className={classes.info}>Username</div>
								<div>
									<Form.Control
										className={classes.textInput}
										type="text"
										value={username}
										onChange={(e) => setUsername(e.target.value)}
									></Form.Control>
								</div>

								<div className={classes.info}>Email</div>
								<Form.Control
									className={classes.emailInput}
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								></Form.Control>

								<div className={classes.info}>Password</div>
								<Form.Control
									className={classes.textInput}
									type="text"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								></Form.Control>

								<div className={classes.info}>Confirm your password</div>
								<Form.Control
									className={classes.textInput}
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
						</div>

						<div className={classes.forImage}>
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
