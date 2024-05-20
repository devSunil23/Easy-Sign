import { Typography } from "@mui/material";
import React from "react";
import styles from "../../style/documentActivity.module.css";
const ActivityRow = ({ src, actionAt, date, time, actionCompleted }) => {
  return (
    <li className={styles.tableRow}>
      <div className={styles.firstColDiv}>
        <img src={src} alt="icon" className={styles.actionIcon} />
      </div>
      <div className={styles.secondColDiv}>
        <Typography variant="body" color="text.secondary">
          {actionAt}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {date}
        </Typography>
        <Typography variant="body" color="text.secondary">
          {time}
        </Typography>
      </div>
      <div className={styles.thirdColDiv}>
        <Typography variant="text" color="text.secondary">
          {actionCompleted}
        </Typography>
      </div>
    </li>
  );
};

export default ActivityRow;
