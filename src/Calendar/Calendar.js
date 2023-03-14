import '../App.css';
import { DateTime } from 'luxon';
import { getCases, getDaysInMonth, getFirstDayOfMonth } from '../Utils';
import { useEffect, useState } from 'react';

function DayEventList({ eventsForDay, isShown, setIsShown }) {
  function CloseButton ({ onClick, children }) {
    return (
      <button className="app-close-button" onClick={() => onClick()}>
        {children}
      </button>
    );
  } 

  return (
    <div className="app-calendar-eventslist">
      <CloseButton onClick={() => setIsShown(false)}>&#10006;</CloseButton>
      <ul className="app-calendar-eventslist-list">
        {/* If there are events for the current day, display them, else display an empty case */}
        {eventsForDay.length > 0 ? (
          eventsForDay.map((event, index) => {
            return (
              <li className="app-calendar-eventslist-list-item" key={index}>
                <h3>{ event.title ? event.title : <b>No English Title</b> }</h3>
                <p>{ event.description ? event.description : <b>No English Description</b> }</p>
                <p>{ event.location.address }</p>
                <p>{ event.start.day + '/' + event.start.month + '/' + event.start.year }</p>
              </li>
            )
          })
        ) : (
          <li className="app-calendar-eventslist-list-item">
            <h3 className="app-calendar-eventslist-list-item-title">No Events</h3>
          </li>
        )}
      </ul>
    </div>
  )
}

function Day ({ currentDay, day, eventsForDay, isDayInMonth }) {
  const [isShown, setIsShown] = useState(false);

  function showEvents() {
    console.log("Going to events view");
    // Show Events component and replace Calendar component
    setIsShown(true);
  }

  return (
    <>
      <div className="app-calendar-case" onClick={() => showEvents()}>
      {currentDay.day === day.day && currentDay.month === day.month && currentDay.year === day.year ? <h2 className="app-calendar-case-current-day app-calendar-case-header">{day.day}</h2> : <h2 className="app-calendar-case-header">{day.day}</h2>}
        <div className="app-calendar-case-events">
          <ul className="app-calendar-case-events-list">
            {/* If there are events for the current day, display them, else display an empty case */}
            {eventsForDay.length > 0 ? (
              eventsForDay.slice(0, 3).map((event, index) => {
                return (
                  <li className="app-calendar-case-events-list-item" key={index}>
                     { event.title ? event.title : <b>No English Title</b> }
                  </li>
                )
              })
            ) : (
              <li className="app-calendar-case-events-list-item">
                <h3 className="app-calendar-case-events-list-item-title">No Events</h3>
              </li>
            )}

            {/* If there are more than three events for the current day, display a link to the events page, else display nothing */}
            {eventsForDay.length > 3 ? (
              <li className="app-calendar-case-events-list-item" >
                <b>+{eventsForDay.length-3} events</b>
              </li>
              )
              : (
                <></>
              )
            }
          </ul>
        </div>
      </div>
      {isShown ? <DayEventList eventsForDay={eventsForDay} isShown={isShown} setIsShown={(s) => setIsShown(s)} /> : <></>}
    </>
  )
}


/**
 * The Case component displays the day number and the events for the current day.
 * Multiple events are displayed in a list.
 * @param {*} props
 * @returns 
 */
function Case({ currentDay, day, events, isDayInMonth }) {

  // Get the events for the current day if the day is in the current month
  const eventsForDay = isDayInMonth ? events.filter((event) => event.timings.filter((timing) => timing.start.day === day.day && timing.start.month === day.month && timing.start.year === day.year).length > 0) : [];
  // If there are events for the current day, display them, else display an empty case
  return (
    // If isDayInMonth is true, display the day number and events, else display an empty case
    isDayInMonth ? (
      <Day day={day} eventsForDay={eventsForDay} isDayInMonth={isDayInMonth} currentDay={currentDay} />
    ) : (
      <div className="app-calendar-case app-calendar-case-empty"></div>
    )
  )   
}

export default function Calendar({ locale, currentDay, selectedDate, weekdays, events }) {
  console.log("Rendering Calendar")
  console.log(currentDay)
  // Use React state to get weekdays, etc.
  const [daysInMonth, setDaysInMonth] = useState(getDaysInMonth(selectedDate.month, selectedDate.year));
  const [firstDayOfMonth, setFirstDayOfMonth] = useState(getFirstDayOfMonth(selectedDate.month, selectedDate.year, locale));
  const [firstDayIndex, setFirstDayIndex] = useState(weekdays.indexOf(firstDayOfMonth));
  const [cases, setCases] = useState(getCases(daysInMonth, firstDayOfMonth));

  // When the selected date changes, update the days in month, first day of month, and cases and first day index
  useEffect(() => {
    setDaysInMonth(getDaysInMonth(selectedDate.month, selectedDate.year));
    setFirstDayOfMonth(getFirstDayOfMonth(selectedDate.month, selectedDate.year, locale));
    setFirstDayIndex(weekdays.indexOf(firstDayOfMonth));
    setCases(getCases(daysInMonth, firstDayIndex));
  }, [selectedDate.month, selectedDate.year, locale, weekdays, firstDayOfMonth, daysInMonth, firstDayIndex]);
  
  console.log(weekdays);
  console.log(selectedDate.month);
  console.log(daysInMonth);
  console.log(firstDayOfMonth);
  console.log(firstDayIndex);

  console.log(selectedDate.year);
  console.log(cases);
  console.log("Events :");
  console.log(events);

  return (
    <div className="app-calendar">
      <div className="app-calendar-header-weekdays">
          {weekdays.map((weekday) => {
              return <h2 className="app-calendar-header-weekdays-item" key={weekday}>{weekday}</h2>
          })}
      </div>
      <div className="app-calendar-body-cases">
        {console.log("Rendering cases")}
        {cases.map((index) => {
          if (index % 7 === 0) {
            return (
              <div className="app-calendar-body-row" key={index}>
                {/* Now put seven cases in the row */}
                {cases.slice(index, index + 7).map((day) => {
                  // If the day is in the month, display it
                  if (day + 1 - firstDayIndex <= daysInMonth && day + 1 - firstDayIndex > 0) {
                    return <Case currentDay={currentDay} day={DateTime.local(selectedDate.year, selectedDate.month, day + 1 - firstDayIndex)} events={events} isDayInMonth={true} key={day} />
                  }
                  // Else, display an empty case
                  else {
                    return <Case isDayInMonth={false} key={day} />
                  }
                })}
              </div>
            )
          } else {
            return <></>
          }
        })}
      </div>
    </div>
  )
}