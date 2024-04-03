import "./Queue.css"

type data = {
    data: {
        name:string,
        path:string
    }[]
}

export default function Queue({data}:data){
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