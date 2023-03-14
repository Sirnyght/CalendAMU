import '../App.css';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

export default function Event({ event, isShown, setIsShown }) {
  function CloseButton({ onClick, children }) {
    return (
      <button className="app-close-button" onClick={() => onClick()}>
        {children}
      </button>
    );
  }
  console.log("Rendering Event")

  if (isShown) {  
    return (
      <div className="app-event">
        <CloseButton className="app-close-button" onClick={() => setIsShown(false)}>&#10006;</CloseButton>
        <div className="app-event-title">
          {event.title}
        </div>
        <div className="app-event-startdate">
          {event.start.day + '/' + event.start.month + '/' + event.start.year}
        </div>
        <div className="app-event-longdescription">
          <ReactMarkdown>{event.longDescription}</ReactMarkdown>
        </div>
        <div className="app-event-location">
          {event.location.address}
        </div>
        <div className="app-event-tags">
          {event.tags.join(', ')}
        </div>
      </div>
    );
  } else {
    return (
      <></>
    )
  }
}



