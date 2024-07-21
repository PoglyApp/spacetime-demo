import { useEffect } from "react";
import Tasks from "../../module_bindings/tasks";
import { useAppDispatch } from "../../store/store";
import { addTask, initTasks, removeTask, updateTask } from "../../store/TaskSlice";

const useFetchTasks = (stdbInitialized: boolean) => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        if(!stdbInitialized) return;

        const tasks = Tasks.all();
        dispatch(initTasks(tasks));

        Tasks.onInsert((task, reducerEvent) => {
            dispatch(addTask(task));
        });

        Tasks.onUpdate((oldTask, newTask, reducerEvent) => {
            dispatch(updateTask(newTask));
        });

        Tasks.onDelete((task, reducerEvent) => {
            dispatch(removeTask(task));
        });
    },[stdbInitialized]);
};

export default useFetchTasks;