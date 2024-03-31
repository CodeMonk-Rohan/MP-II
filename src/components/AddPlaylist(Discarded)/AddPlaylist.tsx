import "./AddPlaylist.css"

export default function AddPlaylist()
{
    return(
        <>
            <div className="main-box"> 

                    <div className="browse-playlist">
                        <div onPointerDownCapture={(e) => e.stopPropagation()}>
                            <input type="text" placeholder="Search Playlist"></input>
                            <button>Search</button>
                        </div>
                                <ol onPointerDownCapture={(e) => e.stopPropagation()}>
                                    <li>Hello</li>
                                    <li>Hello</li>
                                    <li>Hello</li>
                                    <li>Hello</li>
                                    <li>Hello</li>
                                    <li>Hello</li>
                                    <li>Hello</li>
                                    <li>Hello</li>
                                    <li>Hello</li>
                                    <li>Hello</li>
                                    <li>Hello</li>
                                    <li>Hello</li>
                                    <li>Hello</li>
                                    <li>Hello</li>
                                    
                                </ol>
                    </div>

                <div className="add-playlist" onPointerDownCapture={(e) => e.stopPropagation()}> 
                <p>Add New Playlist</p>
                <input type="text" placeholder="Enter Name"></input>
                <input type="text" placeholder="Enter URL"></input>
                <button>Add Playlist</button>
                </div>
              

            </div>
        </>
    );
}