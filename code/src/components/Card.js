import React from 'react';
import UrgentIcon from './assets/SVG - Urgent Priority grey.svg';
import HighIcon from './assets/Img - High Priority.svg';
import MediumIcon from './assets/Img - Medium Priority.svg';
import LowIcon from './assets/Img - Low Priority.svg';
import NoPriorityIcon from './assets/No-priority.svg';
import BacklogIcon from './assets/Backlog.svg';

import './Card.css';

function Card({ ticket, userName, userId, groupBy }) { // Accept userId as a prop
    const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 4: return UrgentIcon;
            case 3: return HighIcon;
            case 2: return MediumIcon;
            case 1: return LowIcon;
            case 0: default: return NoPriorityIcon;
        }
    };

    // User color mapping
    const userColors = {
        "usr-1": "#FF5733", // Anoop Sharma
        "usr-2": "#33FF57", // Yogesh
        "usr-3": "#3357FF", // Shankar Kumar
        "usr-4": "#FF33A1", // Ramesh
        "usr-5": "#F0FF33", // Suresh
    };
    console.log(groupBy)

    const userColor = userColors[userId] || "#CCCCCC"; // Fallback color

    return (
        <div className="card">
            {groupBy != "user" && <div className="user-initials" style={{ backgroundColor: userColor }}> {/* Circle with color */}
                {userInitials}
            </div>}
            <h2>{ticket.id}</h2>
            <h3>
               {ticket.title}
            </h3>
            <div className="ticket-details">
                <div className="icon">
                    <img src={getPriorityIcon(ticket.priority)} alt="Priority Icon" className="priority-icon" />
                </div>
                {ticket.tag && (
                    <div className="icon">
                        <h3>
                            <img src={BacklogIcon} alt={`${ticket.tag} Icon`} /> {ticket.tag}
                        </h3>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Card;
