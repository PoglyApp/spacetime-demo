import { Identity, SpacetimeDBClient } from "@clockworklabs/spacetimedb-sdk"
import Guest from "../module_bindings/guest"
import Tasks from "../module_bindings/tasks"
import AddTaskReducer from "../module_bindings/add_task_reducer";
import ClearAllTasksReducer from "../module_bindings/clear_all_tasks_reducer";
import { useEffect, useState } from "react";
import CompleteTaskReducer from "../module_bindings/complete_task_reducer";

const useStDb = (setStdbInitialized: Function, setClient: Function, setIdentity: Function, reconnect: string) => {
    useEffect(() => {
        SpacetimeDBClient.registerTables(Guest, Tasks);
        SpacetimeDBClient.registerReducers(AddTaskReducer, CompleteTaskReducer, ClearAllTasksReducer);
    
        const token = localStorage.getItem("stdbToken-example") || undefined;
        const client = new SpacetimeDBClient(
            "wss://testnet.spacetimedb.com",
            "Test-Checklist",
            token
        );
    
        client.onConnect((token: string, Identity: Identity) => {
            console.log("Connected to StDB! [" + Identity.toHexString() + "]");
            localStorage.setItem("stdbToken-example", token);
            setClient(client);
            setIdentity(Identity);
            client.subscribe([
                "SELECT * FROM Guest",
                "SELECT * FROM Tasks"
            ]);
        });
    
        client.on("initialStateSync", () => {
            setStdbInitialized(true);
        });
    
        client.onError((...args: any[]) => {
            console.log("ERROR", args);
        });
    
        client.connect();
    }, [reconnect]);
};

export default useStDb;