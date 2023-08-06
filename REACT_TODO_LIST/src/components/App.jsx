import React, { useState } from "react";
import Todoitemlist from "./Todoitemlist";


function App() {

    const [inputext, setinputext] = useState("");
    const [item, setitem] = useState([]);

    function handlechange(event){
        const newvalue=event.target.value;
        setinputext(newvalue);
        
    }

    function additem(){
        setitem(prevalue => {
            return [...prevalue ,inputext]
        });

        setinputext("");

    }

    function deleteitem(id){
        setitem((prevalue)=>{
          return  prevalue.filter(
            (item,index)=>{
                return index!==id
            }
          )
        })


    }

    
    return (

        
        <div className="container">
            <div className="heading">
                <h1>To-Do-List</h1>
            </div>
            <div className="form">
                <input class='input' type="text" placeholder="Type here" onChange={handlechange} value={inputext}></input>
                <button onClick={additem}>
                    <span>ADD</span>
                </button>
            </div>
            <div className="list">
                <ul>
                {item.map((todoItem,index) => (
                    <Todoitemlist
                    key={index}
                    id={index}
                    text={todoItem}
                    oncheck={deleteitem}
                    ></Todoitemlist>
                 
                  ))}
                    
                </ul>
            </div>

        </div>
      
    );
  }


  
  export default App;