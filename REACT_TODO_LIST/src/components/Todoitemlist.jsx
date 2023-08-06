import React from "react";

function Todoitemlist(props){

    
    
    
    
    
    return(
        
        <div onClick={()=>{props.oncheck(props.id)}}>
        <li >{props.text}</li>
        </div>

    )
}

export default Todoitemlist;