import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./WebinarForm.css";
import VideoUpload from "../../shared/components/FormElements/VideoUpload";

const UpdateWebinar = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedWebinar, setLoadedWebinar] = useState();
  const wid = useParams().wid;
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      replay: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchWebinar = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/webinars/${wid}`
        );
        setLoadedWebinar(responseData.webinar);
        setFormData(
          {
            title: {
              value: responseData.webinar.title,
              isValid: true,
            },
            description: {
              value: responseData.webinar.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchWebinar();
  }, [sendRequest, wid, setFormData]);

  const webinarUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/webinars/${wid}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/browse");
    } catch (err) {}
  };

  const replaySubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("replay", formState.inputs.replay.value);

      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/webinars/replay/${wid}`,
        "PATCH",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/browse");
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedWebinar && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find webinar!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedWebinar && (
        <form className="webinar-form" onSubmit={webinarUpdateSubmitHandler}>
          <Card className="add-webinar">
            <Input
              id="title"
              element="input"
              type="text"
              label="Title"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid title."
              onInput={inputHandler}
              initialValue={loadedWebinar.title}
              initialValid={true}
            />
            <Input
              id="description"
              element="textarea"
              label="Description"
              validators={[VALIDATOR_MINLENGTH(5)]}
              errorText="Please enter a valid description (min. 5 characters)."
              onInput={inputHandler}
              initialValue={loadedWebinar.description}
              initialValid={true}
            />
            <Button type="submit" disabled={!formState.isValid}>
              UPDATE WEBINAR
            </Button>
          </Card>
        </form>
      )}
      <form onSubmit={replaySubmitHandler}>
        <Card className="add-webinar">
          {isLoading && <LoadingSpinner asOverlay />}
          <VideoUpload
            center
            id="replay"
            className="add-webinar-btn"
            onInput={inputHandler}
            errorText="Please provide a video."
          />
          <Button margin type="submit" disabled={!formState.isValid}>
            ADD REPLAY
          </Button>
        </Card>
      </form>
    </React.Fragment>
  );
};

export default UpdateWebinar;
