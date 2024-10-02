import React, { useEffect, useState, useRef } from 'react';
import Column from './Column';
import './Board.css';
import Displayicon from './assets/Display.svg'
import downIcon from './assets/down.svg';

// List of default statuses that should always be shown
const defaultStatuses = ['Backlog', 'Todo', 'In progress', 'Done', 'Canceled'];

const groupTickets = (tickets, criterion) => {
    return tickets.reduce((acc, ticket) => {
        const key = ticket[criterion] || 'No Group';
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(ticket);
        return acc;
    }, {});
};

const sortTickets = (tickets, criterion) => {
    if (criterion === 'priority') {
        return tickets.sort((a, b) => b.priority - a.priority); // Descending by priority
    } else if (criterion === 'title') {
        return tickets.sort((a, b) => a.title.localeCompare(b.title)); // Ascending by title
    }
    return tickets;
};

function Board() {
    const [tickets, setTickets] = useState([]);
    const [users, setUsers] = useState([]);
    const [groupBy, setGroupBy] = useState('status');
    const [orderBy, setOrderBy] = useState('priority');
    const [displayDropdownOpen, setDisplayDropdownOpen] = useState(false);
    const dropdownRef = useRef(null); // Reference to the dropdown

    useEffect(() => {
        const savedGroupBy = localStorage.getItem('groupBy') || 'status';
        const savedOrderBy = localStorage.getItem('orderBy') || 'priority';
        setGroupBy(savedGroupBy);
        setOrderBy(savedOrderBy);

        fetch('https://api.quicksell.co/v1/internal/frontend-assignment')
            .then(response => response.json())
            .then(data => {
                setTickets(data.tickets || []);
                setUsers(data.users || []);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        localStorage.setItem('groupBy', groupBy);
        localStorage.setItem('orderBy', orderBy);
    }, [groupBy, orderBy]);

    // Handle clicks outside the dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDisplayDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleGroupChange = (event) => {
        setGroupBy(event.target.value);
    };

    const handleOrderChange = (event) => {
        setOrderBy(event.target.value);
    };

    const toggleDisplayDropdown = () => {
        setDisplayDropdownOpen(!displayDropdownOpen); // Toggle dropdown visibility
    };

    // Group tickets based on the selected criterion
    const groupedTickets = groupTickets(tickets, groupBy);

    return (
        <div className="board-container">
            <div className="display-header">
                <div className="dropdowns" ref={dropdownRef}>
                    <div className="display-dropdown">
                        <label onClick={toggleDisplayDropdown} className="dropdown-toggle">{
                            <img src={Displayicon} />
                            
                            } Display{
                                <img src={downIcon} /> 
                            }</label>
                        {displayDropdownOpen && (
                            <div className="dropdown-content">
                                <div>
                                    <label>Grouping--</label>
                                    <select value={groupBy} onChange={handleGroupChange}>
                                        <option value="status">Status</option>
                                        <option value="user">User</option>
                                        <option value="priority">Priority</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Ordering--</label>
                                    <select value={orderBy} onChange={handleOrderChange}>
                                        <option value="priority">Priority</option>
                                        <option value="title">Title</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="board">
                {groupBy === 'status' ? (
                    defaultStatuses.map(status => (
                        <Column
                            key={status}
                            title={status}
                            tickets={sortTickets(groupedTickets[status] || [], orderBy)} // Sort tickets and handle empty groups
                            users={users} // Pass users to Column
                            groupBy={groupBy}
                        />
                    ))
                ) : (
                    Object.keys(groupedTickets).map((key) => (
                        <Column
                            key={key}
                            title={key}
                            tickets={sortTickets(groupedTickets[key], orderBy)}
                            users={users} // Pass users to Column
                            groupBy={groupBy}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default Board;
