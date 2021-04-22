import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "react-video-js-player";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

import "./WebinarDetailPage.css";

const WebinarDeatilPage = () => {
  const [loadedWebinars, setLoadedWebinars] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const wid = useParams().wid;
  let title = loadedWebinars?.title;

  let description = loadedWebinars?.description;
  let category = loadedWebinars?.category;
  let date = loadedWebinars?.date;
  let video;
  loadedWebinars?.replay === ""
    ? (video = "")
    : (video = `${process.env.REACT_APP_ASSET_URL}/${loadedWebinars?.replay}`);
  let image = `${process.env.REACT_APP_ASSET_URL}/${loadedWebinars?.image}`;

  const d = new Date(date);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const webinarDateFormatted =
    monthNames[d.getMonth()] + " " + d.getDate() + " " + d.getFullYear();

  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/webinars/${wid}`
        );
        setLoadedWebinars(responseData.webinar);
      } catch (err) {}
    };
    fetchWebinars();
  }, [sendRequest, wid]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedWebinars && (
        <div className="webinar-detail">
          <div className="webinar-detail__img">
            <img
              className="webinar-detail__img__responsive"
              src={image}
              alt={title}
            />
          </div>
          <div className="webinar-category">
            <p>{category}</p>
          </div>
          <h1>{title + " // " + webinarDateFormatted}</h1>
          <h2>{description}</h2>
          <div className="video__container">
            {video !== "" ? <VideoPlayer src={video} /> : null}
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default WebinarDeatilPage;
