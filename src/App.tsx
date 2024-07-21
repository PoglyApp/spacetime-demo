import { useState } from 'react';
import './App.css';
import useStDb from './StDb/useStDb';
import useFetchTasks from './StDb/Hooks/useFetchTasks';
import Tasks from './module_bindings/tasks';
import AddTaskReducer from './module_bindings/add_task_reducer';
import { useAppSelector } from './store/store';
import ClearAllTasksReducer from './module_bindings/clear_all_tasks_reducer';
import Guest from './module_bindings/guest';
import CompleteTaskReducer from './module_bindings/complete_task_reducer';

function App() {
  const [stdbInitialized, setStdbInitialized] = useState<boolean>(false);

  const tasks: Tasks[] = useAppSelector((state: any) => state.tasks.tasks);

  const [input, setInput] = useState<string>("");

  const client = useStDb(setStdbInitialized);
  useFetchTasks(stdbInitialized);

  let guestId = "0";
  if(client) guestId = Guest.findByIdentity(client!.identity!)?.id.toString() || "0";

  const handleSubmit = (e: any) => {
    e.preventDefault();
    AddTaskReducer.call(input);
    
    setInput("");
  }

  const handleComplete = (e: any) => {
    CompleteTaskReducer.call(e.target.value);
  }

  const handleClearAll = () => {
    ClearAllTasksReducer.call();
  }

  const handleInput = (e: any) => {
    setInput(e.target.value);
  }

  return (
    <div className="App">
      <header className="App-header">
        {!stdbInitialized ? (<>Loading...</>) : (
          <>
            {tasks.length===0 ? (
            <>No Tasks Found!</>
          ) : (
            <>
            <p>Tasks for Guest# {guestId}</p>
              <div>
                {tasks.map((e) => {
                  if(e.guestId.toString() === guestId)
                    if(e.completed)
                      return(
                        <>
                          <div style={{textDecoration:"line-through"}}>{e.name}</div>
                        </>
                      )

                  return(
                  <>
                    <div>{e.name} <button value={e.id} onClick={handleComplete}>Complete</button></div>
                  </>
                  )
                })}
              </div>
            </>
          )}
          <br />
          <form onSubmit={handleSubmit}>
            <input type="text" name="name" value={input} onChange={handleInput} /> <button type="submit" value="Submit">Add Task</button>
          </form>
          <button onClick={handleClearAll}>Clear all tasks!</button>
          </>
        ) }
        
      </header>
    </div>
  );
}

export default App