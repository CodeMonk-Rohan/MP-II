import { FiSearch } from 'react-icons/fi';
import "../SearchBar/SearchBar.css"
export default function SearchBar()
{
    return(
        <>
             <input type="text" placeholder="Search" onPointerDownCapture={(e) => e.stopPropagation()}></input>
             <FiSearch className='search-icon'/>
        </>
       
    );
}