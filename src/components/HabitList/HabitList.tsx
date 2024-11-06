import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import {
  Button,
  Checkbox,
  LinearProgress,
  MenuItem,
  Select,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  bulkEditHabits,
  Habit,
  removeHabit,
  setEditingHabit,
  toggleHabit,
} from "../../store/HabitSlice";
import "./HabitList.css";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

const HabitList: React.FC = () => {
  const { habits } = useSelector((state: RootState) => state.habits);
  const dispatch = useDispatch<AppDispatch>();
  const today = new Date().toISOString().split("T")[0];
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  const [bulkFrequency, setBulkFrequency] = useState<"daily" | "weekly">(
    "daily"
  );

  const handleCheckboxToggle = (habitId: string) => {
    setSelectedHabits((prevSelected) =>
      prevSelected.includes(habitId)
        ? prevSelected.filter((id) => id !== habitId)
        : [...prevSelected, habitId]
    );
  };

  const handleBulkMarkAsComplete = () => {
    selectedHabits.forEach((habitId) =>
      dispatch(toggleHabit({ id: habitId, date: today }))
    );
    setSelectedHabits([]);
  };

  const handleBulkDelete = () => {
    selectedHabits.forEach((habitId) => dispatch(removeHabit(habitId)));
    setSelectedHabits([]);
  };

  const handleBulkEdit = () => {
    dispatch(bulkEditHabits({ ids: selectedHabits, frequency: bulkFrequency }));
    setSelectedHabits([]);
    setShowBulkEdit(false);
  };

  const getStreak = (habit: Habit) => {
    let streak = habit.completedDates.length;
    console.log(streak, "asstreak");
    // const currentDate = new Date();
    // while (true) {
    //   const dateString = currentDate.toISOString().split("T")[0];
    //   if (habit.completedDates.includes(dateString)) {
    //     streak++;
    //     currentDate.setDate(currentDate.getDate() - 1);
    //   } else {
    //     break;
    //   }
    // }
    // console.log(streak,"asstreak2");
    return streak;
  };

  return (
    <div>
      <div
        style={{ visibility: selectedHabits.length > 0 ? "visible" : "hidden" }}
      >
        <div className="bulk-actions">
          <Button
            variant="outlined"
            color="success"
            startIcon={<CheckCircleIcon />}
            onClick={handleBulkMarkAsComplete}
          >
            Mark Selected as Complete
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleBulkDelete}
          >
            Delete Selected
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<EditOutlinedIcon />}
            onClick={() => setShowBulkEdit(true)}
          >
            Bulk Edit
          </Button>
        </div>
      </div>
      {showBulkEdit && (
        <div className="bulk-edit-form">
          <Select
            value={bulkFrequency}
            onChange={(e) =>
              setBulkFrequency(e.target.value as "daily" | "weekly")
            }
          >
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
          </Select>
          <Button variant="contained" color="primary" onClick={handleBulkEdit}>
            Apply Changes
          </Button>
          <Button variant="text" onClick={() => setShowBulkEdit(false)}>
            Cancel
          </Button>
        </div>
      )}
      <div className="list-of-habits">
        {habits.map((habit) => {
          const isSelected = selectedHabits.includes(habit.id);
          return (
            <>
              <div key={habit.id} className="habit-details">
                <div className="habit-content">
                  <div
                    className="edit-button"
                    onClick={() => dispatch(setEditingHabit(habit.id))}
                  >
                    <EditOutlinedIcon />
                  </div>
                  <Checkbox
                    checked={isSelected}
                    onChange={() => handleCheckboxToggle(habit.id)}
                    sx={{ padding: "9px 40px" }}
                  />
                  <div className="basic-habit-data">
                    <div>
                      <h4 className="habit-heading">Habit</h4>
                      <p className="habit-name"> {habit.name}</p>
                    </div>
                    <div>
                      <h4 className="habit-heading">Frequency</h4>
                      <p className="habit-name">{habit.frequency}</p>
                    </div>
                  </div>
                </div>
                <div className="button-container">
                  <div>
                    Current Streak: {getStreak(habit)} days
                    <div className="progress">
                      <LinearProgress
                        variant="determinate"
                        value={
                          habit.frequency === "weekly"
                            ? (getStreak(habit) / 7) * 100
                            : (getStreak(habit) / 1) * 100
                        }
                      />
                    </div>
                  </div>
                  <Button
                    variant="outlined"
                    color={
                      habit.completedDates.includes(today)
                        ? "success"
                        : "primary"
                    }
                    sx={{ maxHeight: "50px" }}
                    startIcon={<CheckCircleIcon />}
                    onClick={() =>
                      dispatch(toggleHabit({ id: habit.id, date: today }))
                    }
                    className="mark-complete-button"
                  >
                    {habit.completedDates.includes(today)
                      ? "Completed"
                      : "Mark as Complete"}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ maxHeight: "50px" }}
                    startIcon={<DeleteIcon />}
                    onClick={() => dispatch(removeHabit(habit.id))}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <div className="separator"></div>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default HabitList;
