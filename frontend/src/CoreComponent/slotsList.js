import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
// import { makeStyles } from "@material-ui/core/styles";
import { apiConfig } from "../config";
import { useParams } from "react-router";
import SlotListComponent from "./slotListComponent";

const SlotList = ({ match }) => {
  let newTime = new Date();

  var todayDate = `${newTime.getFullYear()}-${
    newTime.getMonth() + 1
  }-${newTime.getDate()}`;

  // console.log(todayDate);

  // 2022-1-6T12:57:32
  // '2014-08-18T21:11:54'

  const [date, setDate] = useState(new Date(`${todayDate}`));
  const [value, setValue] = useState([
    {
      id: "",
      booking_date: "",
      start_timing: "",
      end_timing: "",
      patient: "",
      is_pending: false,
      admin_did_accept: false,
    },
  ]);

  const [docInfo, setDocInfo] = useState({
    room_name: "",
    doctor_name: "",
    description: "",
    get_vote_ratio: 0,
  });

  const [doctorImage, setDoctorImage] = useState("");
  const [skills, setSkills] = useState([]);
  const [intrests, setIntrests] = useState([]);
  const [loaded, setLoaded] = useState(true);
  const [error, setError] = useState(false);

  let { id } = useParams();

  const slotListData = useCallback(async () => {
    const userLocal = JSON.parse(localStorage.getItem("userInfo"));

    if (userLocal) {
      const config = {
        headers: {
          Authorization: `Bearer ${userLocal.data.access}`,
        },
      };

      setDate(todayDate);

      if (!loaded) {
        console.log(date);

        const data = await axios.post(
          `${apiConfig.baseUrl}/booking/room/${id}/`,
          { date: date },
          config,
        );
        if (data.data.status === "success") {
          setValue(data.data.data);
          setDate(data.data.date);
          setDocInfo(data.data.doctor_information);
          setSkills(data.data.skills);
          setIntrests(data.data.intrests);
          setDoctorImage(data.data.doctor_pic);
        } else {
          setError(true);
        }
        console.log(data.data);
        console.log(error);
      } else {
        const data = await axios.get(
          `${apiConfig.baseUrl}/booking/room/${id}/`,
          config,
        );
        if (data.data.status === "success") {
          setValue(data.data.data);
          setDate(data.data.date);
          setDocInfo(data.data.doctor_information);
          setSkills(data.data.skills);
          setIntrests(data.data.intrests);
          setDoctorImage(data.data.doctor_pic);
          setLoaded(false);
        } else {
          setError(true);
        }
        console.log(error);
        console.log(data.data);
      }
    }
  }, [date, id, loaded, todayDate, error]);

  // `${newTime.getFullYear()}-${
  //   newTime.getMonth() + 1
  // }-${newTime.getDate()}`

  const handelDate = (newVal) => {
    setDate(
      `${newVal.getFullYear()}-${newVal.getMonth() + 1}-${newVal.getDate()}`,
    );
  };

  const handleSlot = async (value) => {
    const userLocal = JSON.parse(localStorage.getItem("userInfo"));

    if (userLocal) {
      const config = {
        headers: {
          Authorization: `Bearer ${userLocal.data.access}`,
        },
      };
      console.log(value);
      setDate(todayDate);

      if (!loaded) {
        console.log(date);

        const data = await axios.post(
          `${apiConfig.baseUrl}/booking/room/${id}/book/`,
          { date: date, slot_id: value },
          config,
        );

        console.log(data);
      }
    }
  };

  useEffect(() => {
    slotListData();
  }, []);

  return (
    <>
      <SlotListComponent
        doctorImage={doctorImage}
        docInfo={docInfo}
        skills={skills}
        intrests={intrests}
        value={value}
        date={date}
        handelDate={handelDate}
        slotListData={slotListData}
        handleSlot={handleSlot}
      />
    </>
  );
};

export default SlotList;
