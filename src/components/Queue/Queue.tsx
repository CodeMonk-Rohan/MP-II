export default function Queue(){
    return(
        <ol  onPointerDownCapture={(e) => e.stopPropagation()}>
            <li className="q-item-names">Hello </li>  
        </ol>
    );
}