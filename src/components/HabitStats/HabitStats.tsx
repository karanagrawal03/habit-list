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
  const statsData = [
    {
      icon: <EmojiEventsIcon />,
      title: "Longest Streak",
      value: `${getLongestStreak()} days`,
      color1: "#dcfce7",
      color2: "#bbf7d0",
      border: "#86efac",
    },
    {
      icon: <TrendingUpIcon />,
      title: "Today's Completion",
      value: `${getCompletedToday()}%`,
      color1: "#dbeafe",
      color2: "#bfdbfe",
      border: "#93c5fd",
    },
    {
      icon: <FormatListBulletedIcon />,
      title: "Total Habits",
      value: `${habits.length}`,
      color1: "#f3e8ff",
      color2: "#e9d5ff",
      border: "#d8b4fe",
    },
  ];

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
            {statsData.map((stat, index) => (
              <StatCard
                key={index}
                icon={stat.icon}
                title={stat.title}
                value={stat.value}
                color1={stat.color1}
                color2={stat.color2}
                border={stat.border}
              />
            ))}
          </div>
        </DialogContent>

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
