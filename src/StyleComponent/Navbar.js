import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";

import {
	AppBar,
	Toolbar,
	Typography,
	CssBaseline,
	Link,
	Button,
	Avatar,
	Tooltip,
	IconButton,
	Menu,
	MenuItem,
	Box,
} from "@mui/material";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	appBar: {
		borderBottom: `1px solid ${theme.palette.divider}`,
	},
	link: {
		margin: theme.spacing(5),
		padding: theme.spacing(1, 1.5),
		textDecoration: "None",
	},
	toolbarTitle: {
		flexGrow: 1,
	},
}));

function stringToColor(string) {
	let hash = 0;
	let i;

	/* eslint-disable no-bitwise */
	for (i = 0; i < string.length; i += 1) {
		hash = string.charCodeAt(i) + ((hash << 5) - hash);
	}

	let color = "#";

	for (i = 0; i < 3; i += 1) {
		const value = (hash >> (i * 8)) & 0xff;
		color += `00${value.toString(16)}`.substr(-2);
	}
	/* eslint-enable no-bitwise */

	return color;
}

function stringAvatar(name) {
	if (name.split("")) {
		return {
			sx: {
				bgcolor: stringToColor(name),
			},
			children: `${name.split(" ")[0][0]}`,
		};
	} else {
		return {
			sx: {
				bgcolor: stringToColor(name),
			},
			children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
		};
	}
}

function Navbar() {
	const classes = useStyles();
	const [anchorElUser, setAnchorElUser] = React.useState(null);

	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const [user, setUser] = useState("");

	const userData = async () => {
		const userLocal = JSON.parse(localStorage.getItem("userInfo"));
		setUser(userLocal.data);
	};

	const handleLogout = async () => {
		localStorage.removeItem("userInfo");
		document.location.href = "/signin";
	};

	useEffect(() => {
		userData();
	}, []);

	return (
		<React.Fragment>
			<CssBaseline />
			<AppBar
				position="static"
				color="default"
				elevation={0}
				className={classes.appBar}
			>
				<Toolbar className={classes.toolbar}>
					<Typography
						variant="h6"
						color="inherit"
						noWrap
						className={classes.toolbarTitle}
					>
						<Link
							component={NavLink}
							to="/"
							underline="none"
							color="textPrimary"
						>
							RIJ
						</Link>
					</Typography>

					{user ? (
						<>
							<Box sx={{ flexGrow: 0 }} style={{ marginRight: 10 }}>
								<Tooltip title="Open profile">
									<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
										<Avatar {...stringAvatar(user.username)} />
									</IconButton>
								</Tooltip>

								<Menu
									sx={{ mt: "45px" }}
									id="menu-appbar"
									anchorEl={anchorElUser}
									anchorOrigin={{
										vertical: "top",
										horizontal: "right",
									}}
									keepMounted
									transformOrigin={{
										vertical: "top",
										horizontal: "right",
									}}
									open={Boolean(anchorElUser)}
									onClose={handleCloseUserMenu}
								>
									

									{user.is_superuser && (
										<>
											<MenuItem
												style={{
													display: "block",
													textDecoration: "None",
													padding: 0,
													margin: 0,
												}}
												onClick={handleCloseUserMenu}
											>
												<Link
													textAlign="center"
													style={{ display: "block", textDecoration: "None" }}
													color="textPrimary"
													href="#"
													className={classes.link}
													component={NavLink}
													to="/userList"
												>
													User List
												</Link>
											</MenuItem>

											<MenuItem
												style={{
													display: "block",
													textDecoration: "None",
													padding: 0,
													margin: 0,
												}}
												onClick={handleCloseUserMenu}
											>
												<Link
													textAlign="center"
													style={{ display: "block", textDecoration: "None" }}
													color="textPrimary"
													href="#"
													className={classes.link}
													component={NavLink}
													to="/addRoom"
												>
													Create Room
												</Link>
											</MenuItem>
										</>
									)}


{user || user.is_superuser ? (
										<>
											<MenuItem
												style={{
													display: "block",
													textDecoration: "None",
													padding: 0,
													margin: 0,
												}}
												onClick={handleCloseUserMenu}
											>
												<Link
													textAlign="center"
													style={{ display: "block", textDecoration: "None" }}
													color="textPrimary"
													href="#"
													className={classes.link}
													component={NavLink}
													to="/profile"
												>
													Profile
												</Link>
											</MenuItem>
											<MenuItem
												style={{
													display: "block",
													textDecoration: "None",
													padding: 0,
													margin: 0,
												}}
												onClick={handleCloseUserMenu}
											>
												<Link
													textAlign="center"
													style={{ display: "block", textDecoration: "None" }}
													color="textPrimary"
													href="#"
													className={classes.link}
													component={NavLink}
													to="/create"
													onClick={handleLogout}
												>
													Logout
												</Link>
											</MenuItem>
										</>
									) : (
										<div></div>
									)}
								</Menu>
							</Box>
						</>
					) : (
						<>
							<Button
								href="#"
								color="primary"
								variant="outlined"
								className={classes.link}
								component={NavLink}
								to="/signup"
								style={{ marginRight: 10 }}
							>
								Register
							</Button>
							<Button
								href="#"
								color="primary"
								variant="outlined"
								className={classes.link}
								component={NavLink}
								to="/signin"
							>
								Login
							</Button>
						</>
					)}
				</Toolbar>
			</AppBar>
		</React.Fragment>
	);
}

export default Navbar;
