
const Filter = ({search, onChange}) => {
    return (
        <div>
        filer list by 
        <input 
            value={search}
            onChange={onChange}>
        </input>
    </div>
    )
}
 export default Filter 