import React, { useState, useContext } from "react";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";

import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./WebinarItem.css";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const WebinarItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const location = useLocation();
  const userId = useParams().userId;
  const history = useHistory();

  const d = new Date(props.date);
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

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        REACT_APP_BACKEND_URL + `/webinars/${props.id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      props.onDelete(props.id);
      history.push("/browse");
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this webinar? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      <div className="webinar-item">
        {isLoading && <LoadingSpinner asOverlay />}
        <div className="webinar-img">
          <img
            className="webinar-img-responsive"
            src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
            alt={props.title}
          />
        </div>
        <div className="webinar-category">
          <p>{props.category}</p>
        </div>
        <p className="webinar-date">{webinarDateFormatted}</p>
        <Link to={`/webinars/${props.id}`}>
          <p>{props.title}</p>
        </Link>
        {auth.userId === props.creatorId &&
          location.pathname === `/webinars/user/${userId}` && (
            <React.Fragment>
              <div className="webinar-item__actions">
                <Button to={`/webinars/edit/${props.id}`}>EDIT</Button>
                <Button danger onClick={showDeleteWarningHandler}>
                  DELETE
                </Button>
              </div>
            </React.Fragment>
          )}
      </div>
    </React.Fragment>
  );
};

export default WebinarItem;
