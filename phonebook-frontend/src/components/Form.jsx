  
const Form = ({onSubmit, newName, newPhone, onNameChange, onPhoneChange}) => {
    return(
        <form onSubmit={onSubmit}>
        <div>
            name: 
            <input 
            value={newName}
            onChange={onNameChange}/>
        </div>
        <div>
            phone: 
            <input 
            value={newPhone}
            onChange={onPhoneChange}/>
        </div>
        <div>
            <button type="submit">add</button>
        </div>
    </form>
    )
    
}
export default Form
    