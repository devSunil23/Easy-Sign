import React from "react";
import NameEmailShortName from "../Common/NameEmailShortName";
import styles from "../../style/sendReminder.module.css";
import { Button } from "@mui/material";
import { generateSingingLinkFunc } from "../../pages/document/Functions/document";
import { useMessage } from "../Header/Header";
const SingerGenerateLink = ({ signingOrder, documetDetails }) => {
  const { showSuccess, showError } = useMessage();
  /**short name */
  const shortName = signingOrder?.name
    ?.split(" ")
    ?.slice(0, 2)
    ?.map((namePart) => namePart[0])
    .join("");
  /**generate signging link */
  const generateSigningLik = async () => {
    const response = await generateSingingLinkFunc(
      documetDetails,
      signingOrder.email
    );
    if (response.status === 200) {
      const signingLink = `${window.location.origin}/otherSinger?signerAccessToken=${response.data.signerAccessToken}`;
      // Copy the signing link to the clipboard
      try {
        await navigator.clipboard.writeText(signingLink);
        console.log("Signing link copied to clipboard:", signingLink);
        showSuccess("Copied in clipboard");
      } catch (err) {
        showError("Failed to copy");
      }
    }
  };
  return (
    <>
      <div className={styles.mainDivSendMails}>
        <NameEmailShortName shortName={shortName} signingOrder={signingOrder} />
        <Button
          variant="contained"
          color="primary"
          onClick={generateSigningLik}
        >
          Get Signing Link
        </Button>
      </div>
    </>
  );
};

export default SingerGenerateLink;
