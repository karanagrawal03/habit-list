import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { fetchHabits, Habit } from "../../store/HabitSlice";
import {
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import "./HabitStats.css";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import StatCard from "../../common/StatCard";

const HabitStats: React.FC = () => {
  const { habits, isLoading, error } = useSelector(
    (state: RootState) => state.habits
  );
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchHabits());
  }, [dispatch]);

  const getTotalHabits = () => habits.length;

  const getCompletedToday = () => {
    const today = new Date().toISOString().split("T")[0];
    return habits.filter((habit) => habit.completedDates.includes(today))
      .length;
  };

  const getLongestStreak = () => {
    const getStreak = (habit: Habit) => {
      let streak = 0;
      const currentDate = new Date();

      while (true) {
        const dateString = currentDate.toISOString().split("T")[0];
        if (habit.completedDates.includes(dateString)) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }

      return streak;
    };

    return Math.max(...habits.map(getStreak), 0);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (isLoading) {
    return <LinearProgress />;
  }

  if (error) {
    return <p>Error fetching habits: {error}</p>;
  }

  return (
    <div>
      <div className="header-section">
        <h1 className="header-title">My Habits</h1>
        <button className="add-habit-button" onClick={handleOpen}>
          <QueryStatsIcon /> Show Stats
        </button>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiDialog-paper": {
            width: "600px ",
          },
        }}
      >
        <DialogTitle>Habit Statistics</DialogTitle>
        <DialogContent>
          <div className="stats-grid">
            <div className="stat-card streak-card">
              <div className="stat-icon">
                <EmojiEventsIcon />
              </div>
              <div className="stat-info">
                <h3>Longest Streak</h3>
                <p>{getLongestStreak()} days</p>
              </div>
            </div>
            <div className="stat-card completion-card">
              <div className="stat-icon">
                <TrendingUpIcon />
              </div>
              <div className="stat-info">
                <h3>Today's Completion</h3>
                <p>{getCompletedToday()}%</p>
              </div>
            </div>
            <div className="stat-card total-card">
              <div className="stat-icon">
                <FormatListBulletedIcon />
              </div>
              <div className="stat-info">
                <h3>Total Habits</h3>
                <p>{habits.length}</p>
              </div>
            </div>
          </div>
        </DialogContent>
        <StatCard icon={"symbol"} title={"dadsad"} value={"adsadas"} />
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HabitStats;
