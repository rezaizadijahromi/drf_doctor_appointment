import axios from "axios";
import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";
import { apiConfig } from "../config";

import {
	Card,
	Typography,
	CardContent,
	Grid,
	CardMedia,
	Container,
	Button,
	Pagination,
	Box,
} from "@mui/material";

import { NavLink } from "react-router-dom";

function sleep(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

const useStyles = makeStyles((theme) => ({
	card: {
		maxWidth: 600,
		margin: "auto",
		textAlign: "center",
		marginTop: theme.spacing(5),
		paddingBottom: theme.spacing(2),
	},
	error: {
		verticalAlign: "middle",
	},
	title: {
		marginTop: theme.spacing(2),
		color: theme.palette.openTitle,
	},
	textField: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		width: 250,
	},
	submit: {
		margin: "auto",
		marginBottom: theme.spacing(2),
	},
	toolbarTitle: {
		flexGrow: 1,
	},
	link: {
		textDecoration: "None",
	},
}));

const Home = () => {
	const classes = useStyles();
	const [room, setRooms] = useState([
		{
			id: "",
			room_name: "",
			descroption: "",
			doctor: "",
			image: "",
		},
	]);
	const [message, setMessage] = useState("");
	const [messageVarient, setMessageVarient] = useState("info");
	const [load, setLoad] = useState(false);
	const [page, setPage] = useState(1);
	const [pages, setPages] = useState(10);
	const handleChange = (event, value) => {
		setPage(value);
	};

	const userLocal = JSON.parse(localStorage.getItem("userInfo"));

	const roomData = async (page) => {
		if (userLocal != null) {
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
					setRooms(response.data.data);
					setPage(response.data.page);
					setPages(response.data.pages);
				} else {
					setLoad(false);
					setMessageVarient("info");
					setMessage(response.data.message);
					setRooms(response.data.data);
					setPage(response.data.page);
					setPages(response.data.pages);
				}
			} catch (error) {
				setMessage("Some error accure");
				setMessageVarient("error");
			}
		}else if (userLocal == null){
				var response
				if (page === 1) {
					response = await axios.get(
						`${apiConfig.baseUrl}/booking/room/`,
					);
				} else {
					response = await axios.get(
						`${apiConfig.baseUrl}/booking/room/?page=${page}`
					);
				}
				setLoad(true);
				await sleep(500);
				if (response.data.satus === "success") {
					setLoad(false);
					setMessage(response.data.message);
					setMessageVarient("info");
					setRooms(response.data.data);
					setPage(response.data.page);
					setPages(response.data.pages);
				} else {
					setLoad(false);
					setMessageVarient("info");
					setMessage(response.data.message);
					setRooms(response.data.data);
					setPage(response.data.page);
					setPages(response.data.pages);
				}
		}
	};

	useEffect(() => {
		roomData(page);
	}, [page]);

	return (
		<React.Fragment>
			<main>
				<Container maxWidth="md">
					<Grid container spacing={4}>
						{room.map((r, index) => (
							<Grid item key={index} xs={12} sm={6} md={4}>
								<Card className={classes.card} spacing={8}>
									<CardMedia
										className={{
											paddingTop: "56.25%",
										}}
										component="img"
										src={r.image}
									></CardMedia>
									<CardContent>
										<Typography
											className={classes.textField}
											gutterBottom
											variant="h5"
											component="h2"
										>
											Room code:{r.id.substring(1, 5)}
										</Typography>
										<Typography className={classes.textField}>
											Room Name: {r.room_name}
										</Typography>
										<Typography className={classes.textField}>
											Doctor Name: {r.doctor_name}
										</Typography>
									</CardContent>
									
									{userLocal ? (<nav>
										<Link
											color="textPrimary"
											href="#"
											className={classes.link}
											component={NavLink}
											to={`room/${r.id}/`}
										>
											Go To Room
										</Link>
									</nav>) : (<nav>
										<Link
											color="textPrimary"
											href="#"
											className={classes.link}
											component={NavLink}
											to={"/signin"}
										>
											Go To Room
										</Link>
									</nav>)}
									
									{userLocal && userLocal.data.is_superuser && (
										<Button size="small" variant="outlined">
											<Link
												color="textPrimary"
												href="#"
												className={classes.link}
												component={NavLink}
												to={`${r.id}/addSlot`}
											>
												Add Appointment
											</Link>
										</Button>
									)}
								</Card>
							</Grid>
						))}
					</Grid>
				</Container>
			</main>

			{page > 0 ? (
				<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
					minHeight="10vh"
				>
					<Pagination count={pages} page={page} onChange={handleChange} />
				</Box>
			) : (
				<div></div>
			)}
		</React.Fragment>
	);
};

export default Home;
