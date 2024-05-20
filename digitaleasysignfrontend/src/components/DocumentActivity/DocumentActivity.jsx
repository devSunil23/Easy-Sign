import { Typography } from "@mui/material";
import React, { useEffect } from "react";
import styles from "../../style/documentActivity.module.css";
import ActivityRow from "./ActivityRow";
import EditIcon from "../../style/rename.svg";
import SignIcon from "../../style/sign.svg";
import UpdateIcon from "../../style/update.svg";
import CompleteIcon from "../../style/complete.svg";
import PreviewIcon from "../../style/preview.png";
import ShareIcon from "../../style/share.svg";
import { useLocation } from "react-router-dom";
import { useUser } from "../../hooks/Authorize";
const DocumentActivity = ({ documentData }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const activities = queryParams.get("activities");
  const user = useUser();
  const {
    createdAt,
    updatedAt,
    completedAt,
    selectedAction,
    signingOrder,
    status,
  } = documentData;
  const options = { month: "short", day: "numeric", year: "numeric" };
  const timeOptions = {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  };
  /**created time date */
  const createdDateTime = new Date(createdAt);
  const createdDateFormat = createdDateTime.toLocaleDateString(
    "en-US",
    options
  );
  const createdTime = createdDateTime.toLocaleTimeString("en-US", timeOptions);
  /**updated time date */
  const updateDateTime = new Date(updatedAt);
  const updateDateFormat = updateDateTime.toLocaleDateString("en-US", options);
  const updatedTime = updateDateTime.toLocaleTimeString("en-US", timeOptions);
  /**updated time date */
  const completeDateTime = new Date(completedAt);
  const completeDateFormat = completeDateTime.toLocaleDateString(
    "en-US",
    options
  );
  const completetedTime = completeDateTime.toLocaleTimeString(
    "en-US",
    timeOptions
  );
  /* eslint-disable */
  useEffect(() => {
    if (activities) {
      const targetSection = document.getElementById(
        "documentActivityParagraphId"
      ); // Replace with the actual id of your target section
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [activities]);
  /* eslint-enable */
  return (
    <div
      className={styles.documentActivityContainer}
      id="documentActivityParagraphId"
    >
      <Typography
        variant="h6"
        style={{ margin: "20px 0" }}
        color="text.secondary"
      >
        Document Activity
      </Typography>
      <div className={styles.tableContainer}>
        <header className={styles.tableHeader}>
          <div className={styles.firstColDiv}></div>
          <div className={styles.secondColDiv}>
            <Typography variant="h6" color="text.secondary">
              DATE
            </Typography>
          </div>
          <div className={styles.thirdColDiv}>
            <Typography variant="h6" color="text.secondary">
              ACTIONS
            </Typography>
          </div>
        </header>
        <div className={styles.tableActivityContainer}>
          <ActivityRow
            src={EditIcon}
            actionAt={"CREATED AT:"}
            actionCompleted={"Document Created"}
            date={createdDateFormat}
            time={createdTime}
          />
          <ActivityRow
            src={UpdateIcon}
            actionAt={"UPDATED AT:"}
            actionCompleted={"Document Updated"}
            date={updateDateFormat}
            time={updatedTime}
          />
          {selectedAction === "yourself" ? (
            status === "Completed" ? (
              <ActivityRow
                src={SignIcon}
                actionAt={"SIGNED AT:"}
                actionCompleted={`Me (Now) (you) | ${user.email}`}
                date={completeDateFormat}
                time={completetedTime}
              />
            ) : (
              ""
            )
          ) : (
            signingOrder?.map((item, index) => {
              // Create an array to store JSX elements for each type of activity
              const activities = [];
              const sentDate = new Date(item?.sentDate);
              const sendDate = sentDate.toLocaleDateString("en-US", options);
              const sendTime = sentDate.toLocaleTimeString(
                "en-US",
                timeOptions
              );
              /**sent date update here */
              activities.push(
                <ActivityRow
                  key={`sent_${index}`}
                  src={ShareIcon}
                  actionAt={"SENT AT:"}
                  actionCompleted={`${item.name} | ${item.email}`}
                  date={sendDate}
                  time={sendTime}
                />
              );
              // Iterate through viewedDates
              item?.viewedDates?.forEach((viewedDate, index) => {
                const viewDate = new Date(viewedDate);
                const viewdDate = viewDate.toLocaleDateString("en-US", options);
                const viewedTime = viewDate.toLocaleTimeString(
                  "en-US",
                  timeOptions
                );

                // Add JSX element for viewed activity
                activities.push(
                  <ActivityRow
                    key={`viewed_${index}`}
                    src={PreviewIcon}
                    actionAt={"VIEWED AT:"}
                    actionCompleted={`${item.name} | ${item.email}`}
                    date={viewdDate}
                    time={viewedTime}
                  />
                );
              });

              // Check if the status is "signed"
              if (item.status === "signed") {
                const signedDate = new Date(item.actionDate).toLocaleDateString(
                  "en-US",
                  options
                );
                const signedTime = new Date(item.actionDate).toLocaleTimeString(
                  "en-US",
                  timeOptions
                );

                // Add JSX element for signed activity
                activities.push(
                  <ActivityRow
                    key={`signed_${index}`}
                    src={SignIcon}
                    actionAt={"SIGNED AT:"}
                    actionCompleted={`${item.name} | ${item.email}`}
                    date={signedDate}
                    time={signedTime}
                  />
                );
              }

              // Render the activities array
              return activities;
            })
          )}
          {status === "Completed" && (
            <ActivityRow
              src={CompleteIcon}
              actionAt={"COMPLETED AT:"}
              actionCompleted={"Document Completed"}
              date={completeDateFormat}
              time={completetedTime}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentActivity;
