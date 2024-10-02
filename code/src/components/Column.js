import React from 'react';
import Card from './Card';
import BacklogIcon from './assets/Backlog.svg';
import DoneIcon from './assets/Done.svg';
import InProgressIcon from './assets/in-progress.svg';
import TodoIcon from './assets/To-do.svg';
import CancelledIcon from './assets/Cancelled.svg';
import UrgentIcon from './assets/SVG - Urgent Priority colour.svg';
import HighIcon from './assets/Img - High Priority.svg';
import MediumIcon from './assets/Img - Medium Priority.svg';
import LowIcon from './assets/Img - Low Priority.svg';
import NoPriorityIcon from './assets/No-priority.svg';
import addIcon from './assets/add.svg';
import dotsIcon from './assets/3 dot menu.svg';

function Column({ title, tickets, users, groupBy }) {
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'backlog': return BacklogIcon;
      case 'done': return DoneIcon;
      case 'in progress': return InProgressIcon;
      case 'canceled': return CancelledIcon;
      case 'todo': return TodoIcon;
      default: return null;
    }
  };

  // Function to get the highest priority of tickets
  const getHighestPriority = (tickets) => {
    return tickets.reduce((highest, ticket) => {
      return ticket.priority > highest ? ticket.priority : highest;
    }, -1);
  };

  // Get the highest priority for this column
  const highestPriority = getHighestPriority(tickets);

  // Function to get the priority label and icon
  const getPriorityLabelAndIcon = (priority) => {
    switch (priority) {
      case 4: return { label: 'Urgent', icon: UrgentIcon };
      case 3: return { label: 'High', icon: HighIcon };
      case 2: return { label: 'Medium', icon: MediumIcon };
      case 1: return { label: 'Low', icon: LowIcon };
      case 0: return { label: 'No Priority', icon: NoPriorityIcon };
      default: return { label: '', icon: null };
    }
  };

  const groupTicketsByUser = (tickets) => {
    return tickets.reduce((acc, ticket) => {
      const userId = ticket.userId;
      if (!acc[userId]) {
        acc[userId] = [];
      }
      acc[userId].push(ticket);
      return acc;
    }, {});
  };

  const ticketsGroupedByUser = groupTicketsByUser(tickets);
  
  const { label, icon } = getPriorityLabelAndIcon(highestPriority);

  return (
    <div className="column">
      {groupBy === 'status' && (
        <div className="header-container">
          <h3>
            <img src={getStatusIcon(title)} alt={`${title} Icon`} />
            <span>{title} {tickets.length}</span>
          </h3>
          <div className="icons">
            <img src={addIcon} alt="Add Icon" />
            <img src={dotsIcon} alt="Dots Icon" />
          </div>
        </div>
      )}

      {/* Show priority and card count if grouping by priority */}
      {groupBy === 'priority' && label && (
        <div className="header-container">
          <h3>
            <img src={icon} alt={label} className="priority-icon" />
            <span>{label} {tickets.length}</span>
          </h3>
          <div>
            <img src={addIcon} />
            <img src={dotsIcon} />
          </div>
        </div>
      )}

      {/* Render tickets based on grouping */}
      {groupBy === 'user' ? (
      <div className="user-columns-container"> {/* Add a new container for user columns */}
        {Object.keys(ticketsGroupedByUser).map(userId => {
          const userTickets = ticketsGroupedByUser[userId];
          const user = users.find(user => user.id === userId);
          const userName = user ? user.name : 'Unknown User';

          return (
            <div key={userId} className="user-column">
              <h3>{userName} {userTickets.length}</h3>

              <div className="card-container">
                {userTickets.map(ticket => (
                  <Card key={ticket.id} ticket={ticket} userName={userName} userId={userId} groupBy={groupBy} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      <div className="card-container">
        {tickets.map(ticket => {
          const user = users.find(user => user.id === ticket.userId);
          const userName = user ? user.name : 'Unknown User';
          return (
            <Card key={ticket.id} ticket={ticket} userName={userName} userId={user.id} groupBy={groupBy} />
          );
        })}
      </div>
    )}
  </div>
);
}

export default Column;
