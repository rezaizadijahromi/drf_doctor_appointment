import {
	Box,
	ButtonGroup,
	Grid,
	Paper,
	Button,
	TextField,
	Typography,
	CardMedia,
	Link,
} from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";

import { makeStyles } from "@mui/styles";
import Message from "../Component/Message";
import Loader from "../Component/Loader";

import { NavLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	textField: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		width: 300,
		marginTop: 10,
		paddingTop: 5,
	},
	textFieldInline: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		width: 100,
		paddingLeft: theme.spacing(1),
		display: "inline-block",
		border: `1px solid ${theme.palette.divider}`,
		backgroundColor: "darkgray",
		marginTop: 10,
		marginBottom: 5,
	},
	submit: {
		left: "40%",
		marginLeft: 30,
		marginBottom: theme.spacing(2),
		width: 200,
	},

	link: {
		margin: theme.spacing(1, 1.5),
	},
	toolbarTitle: {
		flexGrow: 1,
	},
	paper: {
		margin: theme.spacing(2),
		width: theme.spacing(52),
		height: theme.spacing(60),
	},
	paper1: {
		margin: theme.spacing(2),
		width: theme.spacing(115),
		height: theme.spacing(60),
	},
	paper2: {
		marginLeft: theme.spacing(2),
		marginRight: theme.spacing(2),
		width: theme.spacing(230),
		margin: theme.spacing(2),
		// width: "98%",
		height: theme.spacing(57),
	},
	outerbox: {
		height: "100%",
		display: "inline-block",
		flexDirection: "column",
		// marginLeft: 250,
		// alignItems: "flex-end",
		// justifyContent: "flex-end",
	},
	outerbox1: {
		height: "100%",
		display: "inline-block",
		flexDirection: "column",
		// alignItems: "flex-start",
		// justifyContent: "flex-start",
	},

	rightBox: {
		display: "grid",
		gridTemplateColumns: "repeat(3, 1fr)",
	},
	buttonBox: {
		display: "grid",
		gridTemplateColumns: "repeat(1, 1fr)",
		overflowX: "hidden",
	},
	card: {
		display: "grid",
		gridTemplateColumns: "repeat(3, 1fr)",
		// maxWidth: 600,
		margin: "auto",
		textAlign: "center",
		marginTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
	},
	cardButton: {
		display: "grid",
		gridTemplateColumns: "repeat(1, 1fr)",
		maxWidth: 600,
		margin: "auto",
		textAlign: "center",
		marginTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
		overflowX: "hidden",
	},

	leftContentContainer: {
		gridColumn: 1,
		marginTop: 5,
	},
	centerContentContainer: {
		height: "100%",
		width: "100%",
		gridColumn: 2,
		marginLeft: 10,
		paddingLeft: theme.spacing(2),
		// border: "1px solid #000",
	},
	imgContainer: {
		height: 170,
		width: 250,
	},
	DateContainer: {
		marginTop: 50,
	},
	buttons: {
		width: 165,
		height: 45,
	},
	buttonGroup: {
		overflowY: "scroll",
		overflowX: "hidden",
		height: 430,
	},
	newProduct: {
		border: "1px solid black",
		borderRadius: "20px",
		// margin: "5% 5%",
		padding: "20px",
		direction: "rtl",
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
	"@global": {
		"*::-webkit-scrollbar": {
			width: "0.4em",
		},
		"*::-webkit-scrollbar-track": {
			"-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
		},
		"*::-webkit-scrollbar-thumb": {
			backgroundColor: "rgba(0,0,0,.1)",
			outline: "1px solid slategrey",
		},
	},
}));

const SlotListComponent = ({
	doctorImage,
	docInfo,
	skills,
	intrests,
	value,
	currentUser,
	date,
	handelDate,
	slotListData,
	handleSlot,
	handleDeleteSlot,
	freeSlots,
	pendingSlots,
	bookedSlots,
	message,
	messageVarient,
	loadList,
	statusUser,
	handelManagment,
	idValue,
	findNearestSlot,
	patient,
}) => {
	const classes = useStyles();
	return (
		<>
			{message && <Message variant={messageVarient}>{message}</Message>}
			{loadList ? (
				<Loader />
			) : (
				<>
					<div className={classes.rightBox}>
						<Box className={classes.outerbox1}>
							<Paper className={classes.paper1} elevation={3}>
								<Box m={3}>
									<Grid item xs={12}>
										<Grid container justifyContent="center" spacing={2}>
											<div className={classes.card}>
												<div className={classes.imgContainer}>
													<CardMedia
														className={classes.ImageDoc}
														component="img"
														src={doctorImage}
													></CardMedia>
												</div>

												<div className={classes.centerContentContainer}>
													<Typography
														className={classes.textField}
														gutterBottom
													>
														Room Name: {docInfo.room_name}
													</Typography>
													<Typography className={classes.textField}>
														Doctor Name: {docInfo.doctor_name}
													</Typography>
													<Typography className={classes.textField}>
														Vote Ratio: {docInfo.get_vote_ratio}/5
													</Typography>

													{docInfo.description ? (
														<Typography className={classes.textField}>
															{" "}
															{docInfo.description}{" "}
														</Typography>
													) : (
														""
													)}

													{skills.length > 0 ? (
														<Typography className={classes.textField}>
															{skills.map((skill, index) => {
																return (
																	<Typography
																		className={classes.textFieldInline}
																		key={index}
																	>
																		{skill}
																	</Typography>
																);
															})}{" "}
														</Typography>
													) : (
														""
													)}

													{intrests.length > 0 ? (
														<Typography className={classes.textField}>
															{intrests.map((intrest, index) => {
																return (
																	<Typography
																		className={classes.textFieldInline}
																		key={index}
																	>
																		{intrest}
																	</Typography>
																);
															})}{" "}
														</Typography>
													) : (
														""
													)}
												</div>

												<div className={classes.rightContentContainer}>
													<Grid>
														<Typography>
															Availabel slots: {freeSlots > 0 ? freeSlots : 0}
														</Typography>
														<Typography>
															Booked slots: {bookedSlots > 0 ? bookedSlots : 0}
														</Typography>
														<Typography>
															Pending slots:{" "}
															{pendingSlots > 0 ? pendingSlots : 0}
														</Typography>
													</Grid>
												</div>
											</div>
										</Grid>
									</Grid>

									<div className={classes.DateContainer}>
										<Grid container justifyContent="center" spacing={2}>
											<LocalizationProvider dateAdapter={AdapterDateFns}>
												<DesktopDatePicker
													label="Date&Time picker"
													value={date}
													onChange={handelDate}
													renderInput={(params) => <TextField {...params} />}
												/>
											</LocalizationProvider>
										</Grid>
									</div>
								</Box>
								<Button
									color="primary"
									variant="contained"
									onClick={slotListData}
									className={classes.submit}
									style={{ display: "block" }}
								>
									get
								</Button>

								<Button
									color="primary"
									variant="contained"
									onClick={findNearestSlot}
									className={classes.submit}
									style={{ marginTop: "5px", display: "block" }}
								>
									nearest
								</Button>
							</Paper>
						</Box>

						{value.length > 0 ? (
							<Box className={classes.outerbox}>
								<Paper className={classes.paper} elevation={3}>
									<Box m={3}>
										<Grid item xs={12}>
											<Grid
												container
												justifyContent="center"
												spacing={2}
												className={classes.buttonGroup}
											>
												{value.map((slots, index) => (
													<Grid key={index} item>
														<ButtonGroup
															variant="contained"
															aria-label="outlined primary button group"
														>
															{slots.is_pending === false &&
															slots.admin_did_accept === false ? (
																<Button
																	className={classes.buttons}
																	onClick={() => handleSlot(slots.id)}
																	onSubmit={handleSlot}
																>
																	{slots.start_timing} - {slots.end_timing}
																</Button>
															) : (
																// {slots.patient_name == currentUser ? classes.buttons : classes.buttons}

																<Button
																	color={
																		slots.patient_name === currentUser
																			? "warning"
																			: "inherit"
																	}
																	className={classes.buttons}
																	onClick={() => handleDeleteSlot(slots.id)}
																	onSubmit={handleDeleteSlot}
																>
																	{slots.patient_name === currentUser
																		? "Your appointment"
																		: "not availabel"}
																</Button>
															)}
														</ButtonGroup>
													</Grid>
												))}
											</Grid>
											{statusUser && (
												<Button
													style={{
														textAlign: "center",
														left: "40%",
														marginTop: "10px",
													}}
													variant="outlined"
													size="small"
													onClick={() => handelManagment(idValue)}
												>
													manage
												</Button>
											)}
										</Grid>
									</Box>
								</Paper>
							</Box>
						) : (
							<Box className={classes.outerbox}>
								<Paper className={classes.paper} elevation={3}>
									<Box m={3}>
										<Grid item xs={12}>
											<Grid container justifyContent="center" spacing={2}>
												No Appointment
											</Grid>
										</Grid>
									</Box>
								</Paper>
							</Box>
						)}
					</div>

					<div>
						{patient.patient_name ? (
							<>
								<div className={classes.buttonBox}>
									<Box className={classes.outerbox2}>
										<Paper
											className={classes.paper2}
											style={{ width: "1375px", height: "475px" }}
											elevation={3}
										>
											<Box m={3} pt={1}>
												<Grid item xs={12}>
													<div className={classes.newProduct}>
														<div className={classes.halfDiv}>
															<div
																style={{
																	direction: "rtl",
																	width: "70%",
																	borderLeft: "dotted 1px #808080",
																	margin: "20px",
																	padding: "10px",
																}}
															>
																<div
																	className={classes.info}
																	style={{ textAlign: "center" }}
																>
																	Slot id
																</div>
																<div>
																	<Typography style={{ textAlign: "center" }}>
																		{patient.id}
																	</Typography>
																</div>
																<div
																	className={classes.info}
																	style={{ textAlign: "center" }}
																>
																	Patient Name
																</div>
																<div>
																	<Typography style={{ textAlign: "center" }}>
																		{patient.patient_name}
																	</Typography>
																</div>
																<div
																	className={classes.info}
																	style={{ textAlign: "center" }}
																>
																	Doctor Name
																</div>
																<div>
																	<Typography style={{ textAlign: "center" }}>
																		{docInfo.doctor_name}
																	</Typography>
																</div>

																<div
																	className={classes.info}
																	style={{ textAlign: "center" }}
																>
																	Meeting
																</div>
																<div>
																	<Typography style={{ textAlign: "center" }}>
																		{patient.end_timing} -{" "}
																		{patient.start_timing}{" "}
																	</Typography>
																</div>
																<div
																	className={classes.info}
																	style={{ textAlign: "center" }}
																>
																	Status
																</div>
																<div>
																	<Typography style={{ textAlign: "center" }}>
																		{patient.is_pending
																			? "Pending"
																			: "Accepted"}
																	</Typography>
																</div>
																<Button
																	variant="contained"
																	color="warning"
																	className={classes.buttons}
																	style={{ marginTop: 50, marginRight: "37%" }}
																	onClick={() => handleDeleteSlot(patient.id)}
																>
																	Cancell
																</Button>
															</div>
															<div
																className={classes.forImage}
																style={{ width: "20%" }}
															>
																<CardMedia
																	component="img"
																	src={patient.patient_image}
																	style={{
																		objectFit: "contain",
																		height: 350,
																		width: 250,
																	}}
																></CardMedia>
															</div>
														</div>
													</div>
												</Grid>
											</Box>
										</Paper>
									</Box>
								</div>{" "}
							</>
						) : (
							<div></div>
						)}
					</div>
				</>
			)}
		</>
	);
};

export default SlotListComponent;
