import { useEffect, useState } from "react";
import CardColumn from "./components/CardColumn";
import notesData from "./constants/notesData";

function App(){

  const [notes, setNotes] = useState([]);

  useEffect(()=>{
    setNotes(notesData)
  }, [notes]);

  function countUrgent(){
    return notes.filter(note => note.isUrgent).length;
  }

  return (
    <>
      <div className="m-2">
        <div className="flex flex-row text-center justify-between border-2">
          <h1>Tablica zadań</h1>
          <div>{notes.length}</div>
          <div>{countUrgent()}</div>
        </div>
        
        <div className="flex text-center justify-start gap-5">
          <CardColumn notes={notes}/>
        </div>
      </div>
    </>
  )
}

export default App;