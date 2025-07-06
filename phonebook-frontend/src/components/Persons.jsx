
const Persons = ({person, onDelete}) => {
    return (
        <div>
            <li>
                {person.name} {person.phone}
                <button onClick={onDelete}>delete</button>
            </li>
            
        </div>
    )
}

export default Persons