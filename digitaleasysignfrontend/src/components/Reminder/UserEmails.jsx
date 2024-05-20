import { Checkbox } from "@mui/material";
import React from "react";
import styles from "../../style/sendReminder.module.css";
import NameEmailShortName from "../Common/NameEmailShortName";
const UserEmails = ({ handleChange, signingOrder }) => {
  /**short name */
  const shortName = signingOrder?.name
    ?.split(" ")
    ?.slice(0, 2)
    ?.map((namePart) => namePart[0])
    .join("");

  return (
    <div className={styles.mainDivSendMails}>
      <NameEmailShortName shortName={shortName} signingOrder={signingOrder} />
      <Checkbox
        onChange={handleChange}
        value={signingOrder?.email}
        color="primary" // You can change the color if needed
        inputProps={{ "aria-label": "primary checkbox" }}
        disabled={signingOrder.status === "signed"}
      />
    </div>
  );
};

export default UserEmails;
