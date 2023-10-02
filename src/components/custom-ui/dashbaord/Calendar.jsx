import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { EventContent } from "./";
import api from "../../../utils/api";
import constant from "../../../../constant";
import "./calendar.css";

const Calendar = () => {
  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={(info, successCallback, failureCallback) => {
        const startDate = info.startStr;
        const endDate = info.endStr;

        api
          .get(`${constant.httpsEndpoint}/shifts/calendar-shifts`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("id-token")}`,
            },
            params: {
              startDate,
              endDate,
            },
          })
          .then(response => {
            const data = response.data.map(d => ({
              title: d.client.clientName,
              start: d.date,
              startStr: d.startTime,
              endStr: d.endTime,
              status: d.status,
              position: d.requestedPosition.functionName,
            }));
            successCallback(data);
            console.log(response.data);
          })
          .catch(error => failureCallback(error));
      }}
      eventContent={EventContent}
      locale="fr-ca"
      titleFormat={{ year: "numeric", month: "long" }}
      // eventBackgroundColor="transparent"
      // eventBorderColor="transparent"
      lazyFetching={true}
      dayMaxEventRows={2}
    />
  );
};

export default Calendar;
