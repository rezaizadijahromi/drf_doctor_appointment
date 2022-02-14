import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { apiConfig } from "../config";
import { Button, Input, Link } from "@mui/material";
import { makeStyles } from "@mui/styles";

import Message from "../Component/Message";
import Loader from "../Component/Loader";
import { CardMedia } from "@mui/material";
import { NavLink } from "react-router-dom";
import avatar from "./static/avatar.png";

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
	link: {
		margin: theme.spacing(5),
		padding: theme.spacing(1, 1.5),
		textDecoration: "None",
	},
	addButton: {
		marginTop: 10,
		right: "15%",
		marginBottom: theme.spacing(2),
		width: 200,
	},

	newProduct: {
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
	multiInput: {
		direction: "rtl",
		border: "0",
		fontSize: "10px",
		color: "#333",
		borderRadius: "10px",
		boxShadow: "0 1px 5px rgba(0, 0, 0, 0.2)",
		padding: "20px",
		margin: "5px 0 15px 0",
		width: "570px",
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
	onStore: {
		direction: "rtl",
		border: "1px black solid",
		borderRadius: "20px",
		margin: "0% 5%",
		marginTop: "20px",
		padding: "20px",
	},
	topTitle: {
		fontSize: "30px",
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: "10px",
	},
}));

const AddRoom = () => {
	const classes = useStyles();
	const [message, setMessage] = useState("");
	const [messageVarient, setMessageVarient] = useState("");
	const [load, setLoad] = useState(false);
	const [room, setRoom] = useState([
		{
			id: "",
			room_name: "",
			descroption: "",
			doctor: "",
			image: "",
		},
	]);

	const [slot, setSlot] = useState({
		id: "",
		room_name: "",
		descroption: "",
		doctor: "",
		image: "",
	});

	const [roomName, setRoomName] = useState("");
	const [doctorName, setDoctorName] = useState("");
	const [description, setDescription] = useState("");
	let [image, setImage] = useState(avatar);
	const [result, setResult] = useState(avatar);
	const [page, setPage] = useState(1);
	const [pages, setPages] = useState(10);
	const handleChange = (event, value) => {
		setPage(value);
	};

	const roomList = async () => {
		const userLocal = JSON.parse(localStorage.getItem("userInfo"));

		if (userLocal) {
			const config = {
				headers: {
					Authorization: `Bearer ${userLocal.data.access}`,
				},
			};
			try {
				var response;
				if (page === 1) {
					response = await axios.get(
						`${apiConfig.baseUrl}/booking/room/`,
						config
					);
				} else {
					response = await axios.get(
						`${apiConfig.baseUrl}/booking/room/?page=${page}`,
						config
					);
				}
				setLoad(true);
				await sleep(500);

				if (response.data.satus === "success") {
					setLoad(false);
					setMessage(response.data.message);
					setMessageVarient("info");
					setRoom(response.data.data.slice(0, 4));
					setPage(response.data.page);
					setPages(response.data.pages);
				} else {
					setLoad(false);
					setMessageVarient("info");
					setMessage(response.data.message);
					setRoom(response.data.data.slice(0, 4));
					setPage(response.data.page);
					setPages(response.data.pages);
				}
			} catch (error) {
				setMessage("Some error accure");
				setMessageVarient("error");
			}
		}
	};

	const addRoom = async (e) => {
		const userLocal = JSON.parse(localStorage.getItem("userInfo"));
		if (userLocal) {
			const config = {
				headers: {
					Authorization: `Bearer ${userLocal.data.access}`,
				},
			};
			e.preventDefault();
			let formData = new FormData();
			formData.append("room_name", roomName);
			formData.append("doctor_name", doctorName);
			formData.append("description", description);
			formData.append("image", image);

			const response = await axios.post(
				`${apiConfig.baseUrl}/booking/room/`,
				formData,
				config
			);

			if (response.data.status === "success") {
				setMessage(response.data.message);
				setMessageVarient("success");
				roomList();

				setResult(avatar);
			} else {
				setMessage(response.data.message);
				setMessageVarient("error");
				setLoad(false);
			}
		}
	};

	const imageRef = useRef(null);
	function useDisplayImage() {
		function uploader(e) {
			const imageFile = e.target.files[0];

			const reader = new FileReader();
			reader.addEventListener("load", (e) => {
				setResult(e.target.result);
			});

			reader.readAsDataURL(imageFile);
		}

		return { result, uploader };
	}

	const { resulter, uploader } = useDisplayImage();

	const handelData = (value) => {
		console.log(value);
		setSlot(value);
	};

	useEffect(() => {
		roomList();
	}, []);

	return (
		<>
			{message && <Message variant={messageVarient}>{message}</Message>}

			{load ? (
				<Loader />
			) : (
				<div>
					<div className={classes.topTitle}>Admin Page RIJ</div>
					<div className={classes.newProduct}>
						<div className={classes.halfDiv}>
							<div
								style={{
									width: "60%",
									borderLeft: "dotted 1px #808080",
									marginLeft: "30px",
									margin: "20px",
									padding: "10px",
								}}
							>
								<div className={classes.info}>Room Name:</div>
								<div>
									<input
										type="text"
										className={classes.textInput}
										onChange={(e) => setRoomName(e.target.value)}
									/>
								</div>
								<div className={classes.info}>Doctor Name:</div>
								<div>
									<input
										type="text"
										className={classes.textInput}
										onChange={(e) => setDoctorName(e.target.value)}
									/>
								</div>

								<div className={classes.info}>Description:</div>
								<div>
									<textarea
										className={classes.multiInput}
										rows="10"
										cols="60"
										name="description"
										onChange={(e) => setDescription(e.target.value)}
									></textarea>
								</div>
							</div>
							<div className={classes.forImage}>
								{image !== "null" ? (
									<CardMedia
										component="img"
										ref={imageRef}
										src={result}
										style={{ objectFit: "contain", height: 350, width: 350 }}
									></CardMedia>
								) : (
									<CardMedia
										component="img"
										style={{ objectFit: "contain", height: 350, width: 350 }}
										src={avatar}
									></CardMedia>
								)}

								<label htmlFor="contained-button-file">
									<Button
										style={{
											marginTop: 10,
											right: "20%",
											width: 200,
										}}
										component="span"
										variant="contained"
									>
										<Input
											accept="image/*"
											id="contained-button-file"
											multiple
											type="file"
											hidden
											style={{ display: "none" }}
											onChange={(e) => {
												setImage(e.target.files[0]);
												uploader(e);
											}}
										/>
										upload
									</Button>
								</label>
							</div>
						</div>
						<Button
							color="primary"
							variant="contained"
							onClick={addRoom}
							className={classes.addButton}
						>
							Add
						</Button>
					</div>
					<div className={classes.onStore}>
						<div className={classes.topText}>Rooms</div>
						{room.map((r, index) => (
							<div class="card" onClick={() => handelData(r)}>
								<img src={r.image} alt="doctor" />
								<hr />
								<section>
									<h2>Room Code: {r.id.substring(1, 10)}</h2>
								</section>

								<section>
									<span>Room Name: {r.room_name}</span>
								</section>

								<section>
									<span>Doctor Name: {r.doctor_name}</span>
								</section>

								<section>
									<nav>
										<Link
											color="textPrimary"
											href="#"
											className={classes.link}
											component={NavLink}
											to={`room/${r.id}/`}
										>
											Go To Room
										</Link>
									</nav>
								</section>
							</div>
						))}
						<Button
							size="small"
							style={{
								position: "absolute",
								marginTop: "160px",
								marginRight: "20px",
							}}
							variant="outlined"
						>
							More
						</Button>
					</div>
				</div>
			)}
		</>
	);
};

export default AddRoom;
