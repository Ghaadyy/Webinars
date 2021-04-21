import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import WebinarList from "../../webinar/components/WebinarList";

const UserWebinars = () => {
  const [loadedWebinars, setLoadedWebinars] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;

  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/webinars/user/${userId}`
        );
        setLoadedWebinars(responseData.webinars);
      } catch (err) {}
    };
    fetchWebinars();
  }, [sendRequest, userId]);

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

export default UserWebinars;
