import { useEffect, useMemo, useState } from 'react';
import './App.css';
import useStDb from './StDb/useStDb';
import AddTaskReducer from './module_bindings/add_task_reducer';
import ClearAllTasksReducer from './module_bindings/clear_all_tasks_reducer';
import CompleteTaskReducer from './module_bindings/complete_task_reducer';
import { Identity, SpacetimeDBClient } from '@clockworklabs/spacetimedb-sdk';
import Tasks from './module_bindings/tasks';
function App() {
  const [stdbInitialized, setStdbInitialized] = useState<boolean>(false);
  const [reconnect, setReconnect] = useState<string>(Date.now().toLocaleString());
  const [client, setClient] = useState<SpacetimeDBClient>();
  const [identity, setIdentity] = useState<Identity>();
  const [input, setInput] = useState<string>("");
  const [tasks, setTasks] = useState<Tasks[]>();

  useStDb(setStdbInitialized, setClient, setIdentity, reconnect);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    AddTaskReducer.call(input);
    
    setInput("");
  }

  useEffect(() => {
    setTasks(Tasks.all());
  },[client?.db.getTable("Tasks").instances.entries()])

  const handleComplete = (e: any) => {
    CompleteTaskReducer.call(e.target.value);
  }

  const handleClearAll = () => {
    ClearAllTasksReducer.call();
  }

  const handleInput = (e: any) => {
    setInput(e.target.value);
  }

  const handleDisconnect = () => {
    if(!client) return;
    client.disconnect();
    client.live = false;
    setStdbInitialized(false);
    console.log("Disconnected!!");
  }

  const handleConnect = () => {
    //client?.connect();
    if(client?.live) return;

    setReconnect(Date.now().toLocaleString());
    console.log("Attempted Reconnect");
  }

  const handleStatus = () => {
    console.log("Status", client);
  }

  return (
    <div className="App">
      <header className="App-header">
        {!stdbInitialized ? (<>
          <button onClick={handleConnect}>Connect stdb</button>
          <button onClick={handleStatus}>Status stdb</button></>) : (
          identity&&tasks&&<>
          <button onClick={handleDisconnect}>Disconnect stdb</button>
          <button onClick={handleStatus}>Status stdb</button>
            {tasks.filter((t) => t.identity!==identity).length===0 ? (
            <>No Tasks Found!</>
          ) : (
            <>
            <p>Tasks for Guest# {identity?.toHexString()}</p>
              <div>
                {tasks.map((e) => {
                  if(e.identity.toHexString() === identity?.toHexString()) {
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
                  }
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