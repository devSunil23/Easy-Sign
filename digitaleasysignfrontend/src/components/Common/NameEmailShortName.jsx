import { Typography } from "@mui/material";
import React from "react";
import styles from "../../style/sendReminder.module.css";
const NameEmailShortName = ({ signingOrder, shortName }) => {
  return (
    <>
      <div className={styles.emailUserIconDiv}>
        <div
          className={styles.shortNameDiv}
          style={{ textTransform: "uppercase" }}
        >
          <Typography variant="text" color="text.primary">
            {" "}
            {shortName}
          </Typography>
        </div>
        <div>
          <Typography variant="text" color="text.primary">
            {signingOrder?.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {signingOrder?.email}
          </Typography>
        </div>
      </div>
    </>
  );
};

export default NameEmailShortName;
