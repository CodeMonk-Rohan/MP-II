export default function Queue(){
    return(

        

        <div>
            <div>
                <div>
                       Queue Here
                       {data?.map((song, index)=>(
                        <div key={index}>{song.name}</div>
                       ))}
                </div>
            </div>
        </div>
    );
}