import React from "react";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color1: string;
  color2: string;
  border: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  title,
  value,
  color1,
  color2,
  border,
}) => {
  return (
    <div
      className="stat-card"
      style={{
        background: `linear-gradient(135deg, ${color1}, ${color2})`,
        border: `1px solid ${border}`,
      }}
    >
      <div className="stat-icon">{Icon}</div>
      <div className="stat-info">
        <h3>{title}</h3>
        <p>{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
