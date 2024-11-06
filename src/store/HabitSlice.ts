import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Habit {
  id: string;
  name: string;
  frequency: "daily" | "weekly";
  completedDates: string[];
  createdAt: string;
}

interface HabitState {
  habits: Habit[];
  isLoading: boolean;
  error: string | null;
  editingHabit: Habit | null;
}

const loadHabitsFromLocalStorage = (): Habit[] => {
  const habits = localStorage.getItem("habits");
  console.log(JSON.stringify(habits, null, 2), "fgggggg");
  return habits ? JSON.parse(habits) : [];
};

const saveHabitsToLocalStorage = (habits: Habit[]) => {
  console.log(JSON.stringify(habits, null, 2), "hhhhhhhhh");
  localStorage.setItem("habits", JSON.stringify(habits));
};

const initialState: HabitState = {
  habits: loadHabitsFromLocalStorage(),
  isLoading: false,
  error: null,
  editingHabit: null,
};

export const fetchHabits = createAsyncThunk("habits/fetchHabits", async () => {
  console.log("fetching habits");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const mockHabits: Habit[] = loadHabitsFromLocalStorage();
  return mockHabits;
});

const habitSlice = createSlice({
  name: "habit",
  initialState,
  reducers: {
    addHabit: (
      state,
      actions: PayloadAction<{ name: string; frequency: "daily" | "weekly" }>
    ) => {
      const newHabit: Habit = {
        id: crypto.randomUUID(),
        name: actions.payload.name,
        frequency: actions.payload.frequency,
        completedDates: [],
        createdAt: new Date().toISOString(),
      };
      state.habits.push(newHabit);
      saveHabitsToLocalStorage(state.habits);
    },
    updateHabit: (
      state,
      action: PayloadAction<{
        id: string;
        name: string;
        frequency: "daily" | "weekly";
      }>
    ) => {
      const habit = state.habits.find((h) => h.id === action.payload.id);
      if (habit) {
        habit.name = action.payload.name;
        habit.frequency = action.payload.frequency;
      }
      saveHabitsToLocalStorage(state.habits);
    },
    setEditingHabit: (state, action: PayloadAction<string>) => {
      state.editingHabit =
        state.habits.find((h) => h.id === action.payload) || null;
    },
    clearEditingHabit: (state) => {
      state.editingHabit = null;
    },
    bulkEditHabits: (
      state,
      action: PayloadAction<{ ids: string[]; frequency?: "daily" | "weekly" }>
    ) => {
      const { ids, frequency } = action.payload;
      ids.forEach((id) => {
        const habit = state.habits.find((h) => h.id === id);
        if (habit && frequency) {
          habit.frequency = frequency;
        }
      });
    },
    toggleHabit: (
      state,
      action: PayloadAction<{ id: string; date: string }>
    ) => {
      const habit = state.habits.find((h) => h.id === action.payload.id);
      if (habit) {
        const index = habit.completedDates.indexOf(action.payload.date);
        if (index > -1) {
          habit.completedDates.splice(index, 1);
        } else {
          habit.completedDates.push(action.payload.date);
        }
      }
      saveHabitsToLocalStorage(state.habits);
    },
    removeHabit: (state, action: PayloadAction<string>) => {
      state.habits = state.habits.filter(
        (habit) => habit.id !== action.payload
      );
      saveHabitsToLocalStorage(state.habits);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHabits.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.habits = action.payload;
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch habits";
      });
  },
});
export const {
  addHabit,
  toggleHabit,
  removeHabit,
  setEditingHabit,
  clearEditingHabit,
  updateHabit,
  bulkEditHabits,
} = habitSlice.actions;
export default habitSlice.reducer;
