import React from "react";
import { translateStatus } from "../../utils/translateStatus";
// import { AvatarGroup, Avatar, Typography } from "@mui/material";

const EventContent = eventInfo => {
  const eventData = eventInfo.event._def;
  const frenchStatus = translateStatus(eventData.extendedProps.status);

  return (
    <div className="custom-event">
      <p
        className="event-type"
        style={{ fontWeight: "bold", textTransform: "uppercase" }}
      >
        {eventData.title}
      </p>
      <p className="event-type" style={{ fontStyle: "italic" }}>
        {eventData.extendedProps.position}
      </p>
      <p className="event-time">
        {eventData.extendedProps.startStr} - {eventData.extendedProps.endStr}
      </p>
      <p className="event-status">{frenchStatus}</p>
    </div>
  );
};

export default EventContent;
