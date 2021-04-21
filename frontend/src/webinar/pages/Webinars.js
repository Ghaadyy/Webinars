import React, { useEffect, useState } from "react";

import WebinarList from "../components/WebinarList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Webinars = () => {
  const [loadedWebinars, setLoadedWebinars] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/webinars/browse"
        );
        setLoadedWebinars(responseData.webinars);
        console.log(responseData.webinars);
      } catch (err) {}
    };
    fetchWebinars();
  }, [sendRequest]);

  const webinarDeletedHandler = (deletedWebinarId) => {
    setLoadedWebinars((prevWebinars) =>
      prevWebinars.filter((webinar) => webinar.id !== deletedWebinarId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedWebinars && (
        <WebinarList
          items={loadedWebinars}
          onDeleteWebinar={webinarDeletedHandler}
        />
      )}
    </React.Fragment>
  );
};

export default Webinars;
