import axios from "axios";
import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";
import { apiConfig } from "../config";
import { Form, Button, Row, Col, Container } from "react-bootstrap";

import Message from "../Component/Message";
import Loader from "../Component/Loader";
import "./profile.css";

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

			if (response.data) {
				setUsername(response.data.username);
				setEmail(response.data.email);
				setImage(response.data.profile_pic);
				// Todo Need to add notification
			} else {
				// pop up error messages
			}
		}
	};

	useEffect(() => {
		profileData();
	}, []);

	return (
		<>
			<div class="userInformation">
				<div class="top-text">مشخصات شما:</div>

				<div class="half-div">
					<div class="information">
						<div class="info">نام و نام خانوادگی :</div>
						<div>
							<input type="text" class="intext" />
						</div>
						<div class="info">پست الکترونیک:</div>
						<div>
							<input type="email" class="intext" />
						</div>
						<div class="info">شماره موبایل:</div>
						<div>
							<input type="text" class="intext" />
						</div>
						<div class="info">کلمه عبور:</div>
						<div>
							<input type="password" class="intext" />
						</div>
						<div class="info">تکرار کلمه عبور:</div>
						<div>
							<input type="password" class="intext" />
						</div>
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
								ثبت اطلاعات
							</button>
						</div>
					</div>

					<div class="forimg">
						<img src="../img/useraccount/avatar2.png" />

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
							تغییر اواتار
						</button>
					</div>
				</div>
			</div>
			<div id="orders" class="userInformation">
				<div class="toptext">سفر‌های شما</div>
				<div class="half-div">
					<div class="orderinfo">
						در این قسمت سفر‌های ثبت شده را مشاهده می‌کنید.
					</div>

					<div class="forcard">
						<div class="card">
							<img src="../img/useraccount/hotel4.jpg" />
							<hr />
							<section>
								<h2>نام هتل</h2>
							</section>

							<section>
								<span>قیمت اتاق به ازای هر شب </span>
							</section>

							<section>
								<a href="#">مشاهده هتل</a>
							</section>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Profile;
