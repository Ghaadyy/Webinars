import React, { useState } from "react";
import Button from "../../shared/components/FormElements/Button";

import WebinarItem from "./WebinarItem";
import "./WebinarList.css";
import allCategories from "./allCategories";

const WebinarList = (props) => {
  const [filteredTerm, setFilteredTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  if (props.items.length === 0) {
    return (
      <div className="center">
        <h2>No webinars found.</h2>
      </div>
    );
  }

  return (
    <React.Fragment>
      <input
        className="search-bar"
        type="text"
        placeholder="Search for webinars..."
        onChange={(event) => {
          setFilteredTerm(event.target.value);
        }}
        autoComplete="off"
      />
      <div className="category-list__buttons">
        {allCategories.map((category) => {
          return (
            <Button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.category);
              }}
              category
            >
              {category.category}
            </Button>
          );
        })}
      </div>
      <div className="center webinars-list">
        {props.items // eslint-disable-next-line
          .filter((webinar) => {
            if (selectedCategory === "All" && filteredTerm === "") {
              return webinar;
            } else if (
              webinar.category.includes(selectedCategory) &&
              webinar.title
                .toLowerCase()
                .includes(filteredTerm.toLocaleLowerCase())
            ) {
              return webinar;
            } else if (
              selectedCategory === "All" &&
              webinar.title
                .toLowerCase()
                .includes(filteredTerm.toLocaleLowerCase())
            ) {
              return webinar;
            }
          })
          .map((webinar) => {
            return (
              <WebinarItem
                key={webinar.id}
                id={webinar.id}
                image={webinar.image}
                title={webinar.title}
                description={webinar.description}
                category={webinar.category}
                creatorId={webinar.creator}
                date={webinar.date}
                onDelete={props.onDeleteWebinar}
              />
            );
          })}
      </div>
    </React.Fragment>
  );
};

export default WebinarList;
