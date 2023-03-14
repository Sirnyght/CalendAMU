import logo from './ressources/logo_light.svg';
import './App.css';
import { DateTime } from 'luxon';
import { firstLetterToUppercase, getWeekdays, jsonParser } from './Utils';
import Calendar from './Calendar/Calendar';
import Planning from './Planning/Planning';
import { useEffect, useState } from 'react';

function LanguageChoice({ onChoice }) {
  return (
    // Return a drop down menu with the languages
    <select className="language-choice" onClick={onChoice}>
      <option value="fr">Français</option>
      <option value="en">English</option>
    </select>
  );
}

function DatePicker({ selectedDate, onDateChange }) {
  return (
    <div className="app-header-datepicker">
      <input className="app-header-datepicker-input" type="date" value={selectedDate.toISODate()} onChange={onDateChange} />  
    </div>
  );
}

function NavButton({ onClick, children }) {
  return (
    <button className="nav-button" onClick={onClick}>
      {children}
    </button>
  );
}

function ViewToggle({ onToggle }) {
  return (
    <div className="app-header-view-toggle">
      <label className="app-header-view-toggle-switch">
        <input className="app-header-view-toggle-checkbox" type="checkbox" onClick={onToggle} />
        <span className="app-header-view-toggle-slider-round"></span>
      </label>
    </div>
  );
}


function Header({ selectedDate, onDateChange, onViewChange, onLanguageChange }) {
  return (
    <header className="app-header">
      <img src={logo} className="app-logo" alt="logo" />
      <h1 className="app-header-title">CalendAMU</h1>
      <div className="app-header-content">
        <DatePicker selectedDate={selectedDate} onDateChange={(e) => onDateChange(e.target.value)} />
        {/* <h2 className="app-header-content-day">{firstLetterToUppercase(selectedDate.weekdayLong)} {selectedDate.day}</h2> */}
        {/* Left arrow */}
        {/* Set to previous month */}
        <NavButton onClick={() => onDateChange(selectedDate.minus({ months: 1 }))}>&#9668;</NavButton>
        {/* Month */}
        <h2 className="app-header-content-month">{firstLetterToUppercase(selectedDate.monthLong)}</h2>
        {/* Right arrow */}
        {/* Set to next month */}
        <NavButton onClick={() => onDateChange(selectedDate.plus({ months: 1 }))}>&#9658;</NavButton>
        {/* Insecable space */}
        <h2>&nbsp;</h2>
        {/* Set to previous year */}
        <NavButton onClick={() => onDateChange(selectedDate.minus({ years: 1 }))}>&#9668;</NavButton>
        {/* Year */}
        <h2 className="app-header-content-year">{selectedDate.year}</h2>
        {/* Set to next year */}
        <NavButton onClick={() => onDateChange(selectedDate.plus({ years: 1 }))}>&#9658;</NavButton>
      </div>
      <div className="app-header-language">
        {/* Change language */}
        <LanguageChoice onChoice={(l) => onLanguageChange(l)} />
      </div>
      <div className="app-header-view">
        {/* Change view when toggled */}
        <ViewToggle onToggle={() => onViewChange()} />
      </div>
      
    </header>
  );
}

function App() {
// Block the app and display a loading screen while the events are being fetched
  const [language, setLanguage] = useState('fr');

  const currentDay = DateTime.local({ locale: language });
  // const [mode, setMode] = useState('light');
  const [view, setView] = useState('calendar');
  
  const [weekdays, setWeekdays] = useState(getWeekdays(language));
  const [selectedDate, setSelectedDate] = useState(currentDay);
    
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setWeekdays(getWeekdays(language));
    setSelectedDate(s => DateTime.fromISO(s.toISODate(), { locale: language }));
  }, [language]);


  useEffect(() => {
    fetch('events-arles.json')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setEvents(jsonParser(data, language));
      })
      .catch((error) => {
        console.error('Error:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [language]);

  if (loading) {
    return (
      // Display a loading screen while the events are being fetched
      <div className="app-loading">
        <h1>Loading...</h1>
      </div>
    );
  }
 
  console.log(events);  
  console.log('Rendering App...')

  return (
    <>
      <Header selectedDate={selectedDate} onDateChange={newDate => setSelectedDate(DateTime.fromISO(newDate))} onViewChange={() => setView(view === 'calendar' ? 'planning' : 'calendar')} onLanguageChange={(l) => setLanguage(l.target.value)} />
      <main className="app-main">
        {/* If view is set to calendar */}
        {view === 'calendar' && <Calendar locale={language} currentDay={currentDay} selectedDate={selectedDate} events={events} weekdays={weekdays} />}
        {/* If view is set to planning */}
        {view === 'planning' && <Planning startingDate={selectedDate} events={events} locale={language} />}
      </main>
    </>
  );
}

export default App;
