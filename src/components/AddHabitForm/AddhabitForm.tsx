import { Button, MenuItem, Select, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  addHabit,
  clearEditingHabit,
  updateHabit,
} from "../../store/HabitSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import HabitList from "../HabitList/HabitList";
import HabitStats from "../HabitStats/HabitStats";
import "./AddhabitForm.css";

const AddhabitForm: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [frequency, setFrequency] = useState<"daily" | "weekly">("weekly");
  const dispatch = useDispatch<AppDispatch>();
  const { editingHabit } = useSelector((state: RootState) => state.habits);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (editingHabit) {
      setName(editingHabit.name);
      setFrequency(editingHabit.frequency);
      setIsEditing(true);
    }
  }, [editingHabit]);

  const handleSaveHabit = () => {
    if (name.trim()) {
      if (isEditing && editingHabit) {
        dispatch(updateHabit({ id: editingHabit.id, name, frequency }));
      } else {
        dispatch(
          addHabit({
            name,
            frequency,
          })
        );
      }
      resetForm();
      setName("");
      setFrequency("weekly");
      setIsEditing(false);
      dispatch(clearEditingHabit());
    }
  };
  const handleCancel = () => {
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setFrequency("weekly");
    setIsEditing(false);
    dispatch(clearEditingHabit());
  };

  return (
    <div>
      <HabitStats />

      <div className="addHabitForm">
        <TextField
          value={name}
          label="Habit Name"
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter the habit"
          fullWidth
          className="habit-input"
        />
        <Select
          onChange={(e) => setFrequency(e.target.value as "daily" | "weekly")}
          value={frequency}
          fullWidth
        >
          <MenuItem value="daily">Daily</MenuItem>
          <MenuItem value="weekly">Weekly</MenuItem>
        </Select>
        <Button
          variant="outlined"
          fullWidth
          onClick={handleSaveHabit}
          className="submit-button"
        >
          {isEditing ? "Update Habit" : "Add Habit"}
        </Button>
        {isEditing && (
          <Button
            variant="outlined"
            fullWidth
            onClick={handleCancel}
            className="cancel-button"
          >
            Cancel
          </Button>
        )}
      </div>
      <div>
        <HabitList />
      </div>
    </div>
  );
};

export default AddhabitForm;
