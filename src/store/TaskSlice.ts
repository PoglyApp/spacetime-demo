import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Tasks from "../module_bindings/tasks";

interface TaskState {
  tasks: Tasks[];
}

const initialState: TaskState = {
  tasks: [],
};

export const TaskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    initTasks: (state, action: PayloadAction<Tasks[]>) => {
      state.tasks = [...action.payload];
    },

    addTask: (state, action: PayloadAction<Tasks>) => {
      state.tasks.push(action.payload);
    },

    updateTask: (state, action: PayloadAction<Tasks>) => {
      const elements = state.tasks;
      const element = elements.findIndex((e) => e.id === action.payload.id);

      elements[element] = action.payload;
      state.tasks = [...elements];
    },

    removeTask: (state, action: PayloadAction<Tasks>) => {
      state.tasks = state.tasks.filter((tasks) => {
        return tasks.id !== action.payload.id;
      });
    },
  },
});

export default TaskSlice.reducer;
export const { initTasks, addTask, removeTask, updateTask } =
  TaskSlice.actions;
