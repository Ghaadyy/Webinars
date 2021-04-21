import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import Calendar from "react-calendar";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import Card from "../../shared/components/UIElements/Card";
import allCategories from "../components/allCategories";
import "./WebinarForm.css";
import "./Calendar.css";

const AddWebinar = () => {
  const [date, setDate] = useState(new Date());

  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      category: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const calendarHandler = (date) => {
    setDate(date);
  };

  const history = useHistory();

  const webinarSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("category", formState.inputs.category.value);
      formData.append("image", formState.inputs.image.value);
      formData.append("date", date);

      await sendRequest(REACT_APP_BACKEND_URL + "/webinars", "POST", formData, {
        Authorization: "Bearer " + auth.token,
      });
      history.push("/browse");
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form onSubmit={webinarSubmitHandler}>
        <Card className="add-webinar">
          {isLoading && <LoadingSpinner asOverlay />}
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (at least 5 characters)."
            onInput={inputHandler}
          />
          <Input
            id="category"
            element="dropdown"
            label="Category"
            placeholder="Select a category"
            options={allCategories}
            onInput={inputHandler}
            validators={[]}
          />
          <Calendar
            onChange={calendarHandler}
            value={date}
            minDate={new Date()}
          />
          <ImageUpload
            center
            id="image"
            className="add-webinar-btn"
            onInput={inputHandler}
            errorText="Please provide an image."
          />
          <Button margin type="submit" disabled={!formState.isValid}>
            ADD WEBINAR
          </Button>
        </Card>
      </form>
    </React.Fragment>
  );
};

export default AddWebinar;
