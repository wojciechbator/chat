import React from 'react';
import Person from '../components/person.jsx';

const PeopleList = (props) => {
    const personNodes = props.people.map((person) => {
        return (
            <Person type={person.type} key={person.id}>
                {person.username}
            </Person>
        );
    });
    return (
        <div className="peopleList">
            <div className="peopleTitle">
                Dostępni użytkownicy
            </div>
            {personNodes}
        </div>
    );
}

export default PeopleList;
