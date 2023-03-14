import '../App.css';
import { DateTime } from 'luxon';
import { useState } from 'react';
import Event from '../Event/Event';

// application affiche une liste chronologique des événements à venir à partir d’une date sélectionnée. Cette liste doit rester synthétique. En cliquant sur un événement, l’utilisateur doit pouvoir accéder à son détail. Dans cette vue, l’utilisateur doit également être en mesure de filtrer les données affichées. Pour cela, il doit avoir à sa disposition un ensemble de tags qu’il peut activer ou désactiver. Cette liste de tags devra être construite à partir des données présentes dans le fichier fourni. Seuls les événements dont au moins un des tags associés est actif doivent être affichés.

// 1. Afficher la liste des événements à venir à partir d’une date sélectionnée
// 2. Afficher le détail d’un événement
// 3. Afficher les tags et filtrer les événements

// function Page({ startingDate, events, locale, children }) {
//   return (
//     <div className="app-planning-page">
//       {children}
//     </div>
//   );
// }
function Tag({ activeTags, tag, setTags, checked }) {
  return (
    <div className="app-planning-tag">
      {/* Tag is a label for checkbox */}
      <label className="app-planning-tag-label">
        {/* If  allTagsChecked, default state of checkboxes is true */}
        <input className="app-planning-tag-checkbox" type="checkbox" checked={checked}
        // On change, check or uncheck tag and update activeTagsList
        onChange={(e) => setTags(e.target.checked ? [...activeTags, tag] : activeTags.filter((t) => t !== tag))} />
        {/* Tag is a span */}
        <span className="app-planning-tag-span">{tag}</span>
      </label>
    </div>
  );
}

function TagList({ tags, setTags, activeTags }) {
  const [allTagsChecked, setAllTagsChecked] = useState(false);

  return (
    <div className="app-planning-taglist">
      {/* Check all tags checkbox */}
      <div className="app-planning-taglist-checkall">
        <label className="app-planning-taglist-checkall-label">
          <input className="app-planning-taglist-checkall-checkbox" type="checkbox" defaultChecked={allTagsChecked}
          // On change, check or uncheck all tags and update allTagsChecked
          onChange={(e) => { 
            setAllTagsChecked(e.target.checked);
            setTags(e.target.checked ? tags : []);
          }} />
          <span className="app-planning-taglist-checkall-span">Check all</span>
        </label>
      </div>
      <br />
      {/* If tag is checked or unchecked, update activeTagsList */}
      {tags.map((tag, index) => <Tag tag={tag} setTags={tags => setTags(tags)} activeTags={activeTags} key={index} checked={activeTags.includes(tag) ? true : false} />)}

    </div>
  );
}

function Day({ events, day, activeTags }) {
  const eventsForDay = events.filter((event) => event.timings.filter((timing) => timing.start.day === day.day && timing.start.month === day.month && timing.start.year === day.year).length > 0);
  const filteredEventsForDay = eventsForDay.filter((event) => event.tags.filter((tag) => activeTags.includes(tag)).length > 0);
  return (
    <div className="app-planning-row">
      {filteredEventsForDay.map((event, index) => <Item event={event} key={index} />)}
    </div>
  );
}

function Item({ event }) {
  const [isShown, setIsShown] = useState(false);

  function showEvent() {
    console.log("Going to event view");
    // Show Event component and replace Planning component
    setIsShown(true);
  }

  return ( 
    <>
      <button className="app-planning-row-item" onClick={() => {showEvent()}}>
          <div className="app-planning-row-item-title">
            {event.title ? event.title : <b>No title</b> }        
          </div>
          <div className="app-planning-row-item-description">
            {event.description}
          </div>
          {/* <ReactMarkdown className="app-planning-row-item-longdescription">{event.longDescription}</ReactMarkdown> */}
          <div className="app-planning-row-item-tags">
            {event.tags.join(', ')}
          </div>
      </button>
      {isShown ? <Event event={event} isShown={isShown} setIsShown={s => setIsShown(s)} /> : <></>}
    </>
  );
}

export default function Planning({ startingDate, events, locale }) {
  const [activeTags, setActiveTags] = useState([]);
  console.log("Rendering Planning")

  const lastDayWithEvents = events.map((event) => {
    return event.timings.map((timing) => {
      return timing.end;
    })
  }).flat().sort((a, b) => {
    return a - b;
  }).pop();

  const tagList = events.map((event) => {
    return event.tags;
  }).flat().sort().filter((tag, index, array) => {
    return array.indexOf(tag) === index;
  });

  // useEffect(() => {
  //   setActiveTags(tagList);
  // }, []);
  
  // const tenDaysAfterStartingDate = startingDate.plus({days: 3});
  // const tenDaysAfterStartingDate = startingDate;

  console.log(tagList);

  console.log(lastDayWithEvents); 

  return (
    <div className="app-planning">
      <TagList tags={tagList} setTags={tags => setActiveTags(tags)} activeTags={activeTags} />
      {console.log(activeTags)}
      {/* For all days from the starting date to the last day with events, display a row */}
      <div className="app-planning-body">
      {Array.from({length: lastDayWithEvents.diff(startingDate, 'days').days + 1}, (v, i) => i).map((day, index) => {
        return (
          // Render only 3 days at a time, with a button to go to the next 3 days
          <div className="app-planning-row" key={index}>
            <div className="app-planning-row-date">
              {startingDate.plus({days: day}).toLocaleString(DateTime.DATE_FULL)}
            </div>
            <div className="app-planning-row-items">
              <Day events={events} day={startingDate.plus({days: day})} activeTags={activeTags} />
            </div>
          </div>
        );
      })}  
      </div>
    </div>
  );
}
