import axios from "axios";
import React, { useState, useEffect } from "react";
import { apiConfig } from "../config";
import { Form } from "react-bootstrap";

import Message from "../Component/Message";
import Loader from "../Component/Loader";
import "./profile.css";
import { CardMedia } from "@mui/material";

{
	/* {message && <Message variant="danger">{message}</Message>}
					{success && <Message variant="success">Profile Updated</Message>} */
}

const Profile = () => {
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

	const uploadFileHandler = async (e) => {
		const file = e.target.files[0];
		const formData = new FormData();
		formData.append("image", file);
		try {
			const config = {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			};
			const { data } = await axios.post("/api/upload", formData, config);
			setImage(data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		profileData();
	}, []);

	return (
		<>
			<div class="userInformation">
				<div class="top-text">User Information:</div>

				<div class="half-div">
					<div class="information">
						<div class="info">Username</div>
						<Form.Control
							className="intext"
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						></Form.Control>

						<div class="info">Email</div>
						<Form.Control
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						></Form.Control>

						<div class="info">Password</div>
						<Form.Control
							className="intext"
							type="text"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						></Form.Control>

						<div class="info">Confirm your password</div>
						<Form.Control
							className="intext"
							type="text"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						></Form.Control>

						<div>
							<button
								class="
                      button
                      btn btn-lg btn-primary btn-submit
                      fw-bold
                      text-uppercase
                    "
								type="submit"
							>
								Update
							</button>
						</div>
					</div>

					<div class="forimg">
						<CardMedia component="img" src={image}></CardMedia>
						{/*             
						<Form.File
							id="image-file"
							label="Choose File"
							custom
							onChange={uploadFileHandler}
						></Form.File> */}
						{/* {uploading && <Loader />} */}
						<button
							class="
                     button-avatar
                      button-main-avatar
                      btn btn-lg 
                      fw-bold
                      text-uppercase
                    "
							type="submit"
						>
							Change the profile picture
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default Profile;
