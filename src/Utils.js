import { DateTime } from 'luxon';

/**
 * This function is used to parse a JSON file
 * @returns A JSON object
 */
export const jsonParser = (data, locale) => {
  console.log("Getting events from JSON file...");
  const events = data.events.map((event) => {
    return {
      id: event.uid,
      // Title and description are in "locale" parameter
      title: event.title[locale],
      // If the description is not null, return it, else return null
      description: event.description ? event.description[locale] : null,
      longDescription: event.longDescription ? event.longDescription[locale] : null,
      // Start and End are firstDate and lastDate in the JSON file, formatted like this: 2022-09-01 
      start: DateTime.fromFormat(event.firstDate, 'yyyy-MM-dd'),
      end: DateTime.fromFormat(event.lastDate, 'yyyy-MM-dd'),
      timings: event.timings.map((timing) => {
        return {
          start: DateTime.fromISO(timing.start),
          end: DateTime.fromISO(timing.end),
        };
      }),
      location: event.location,
      tags: event.tags.map((tag) => { tag = tag.label; return tag; }),
    };
  });
  return events;
}

/**
 * Put the first letter of a string in uppercase
 * @param {*} string 
 * @returns 
 */
export const firstLetterToUppercase = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * This function is used to get the weekdays from Luxon in given language
 * @returns An array of weekdays
 */
export const getWeekdays = (l) => {
  const weekdays = [];
  console.log("Getting weekdays from Luxon...");
  for (let i = 1; i <= 7; i++) {
    // Get weekdays in French and put the first letter in uppercase
    weekdays.push(firstLetterToUppercase(DateTime.local().setLocale(l).set({ weekday: i }).weekdayLong));
  }
  return weekdays;
}

export const getFirstDayOfMonth = (month, year, l) => {
  console.log("Getting first day of month from Luxon...");
  return firstLetterToUppercase(DateTime.local({locale: l}).set({ month: month, year: year }).startOf('month').weekdayLong);
}

export const getDaysInMonth = (month, year) => {
  console.log("Getting days in month from Luxon...");
  return DateTime.local().set({ month: month, year: year }).daysInMonth;
}

export const getCases = (daysInMonth, firstDayIndex) => {
  console.log("Getting calendar cases...");
  const cases = [];
  // If the month has 31 days and the first day of the month is a Saturday or Sunday, or if the month has 30 days and the first day of the month is a Sunday, create an array of 42 days
  if ((daysInMonth === 31 && (firstDayIndex === 6 || firstDayIndex === 5)) || (daysInMonth === 30 && firstDayIndex === 6)) {
    console.log('42 cases');
    for (let i = 0; i < 42; i++) {
      cases.push(i);
    }
  // If the month has 28 days and the first day of the month is a Monday, create an array of 28 days
  } else if (daysInMonth === 28 && firstDayIndex === 0) {
    console.log('28 cases');
    for (let i = 0; i < 28; i++) {
      cases.push(i);
    }
  } else {
    console.log('35 cases');
    for (let i = 0; i < 35; i++) {
      cases.push(i);
    }
  }
  return cases;
}

