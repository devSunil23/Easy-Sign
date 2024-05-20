import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import "../../style/main.css";
import { useDispatch } from "react-redux";
import {
  selectSignatureText,
  selectSignatureTextType,
} from "../../store/action";

const TextSignature = (props) => {
  const [name, setName] = useState("");
  const [signature, setSignature] = useState("");
  const dispatch = useDispatch();
  const [signatureTextType] = useState("Arial");
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    generateSignature(newName);
  };

  const generateSignature = (inputName) => {
    // You can customize the signature format here
    const formattedSignature = `${inputName}`;
    dispatch(selectSignatureText(formattedSignature));
    setSignature(formattedSignature);
  };
  /**signature text type handller */
  const handleSignatureType = (e) => {
    dispatch(selectSignatureTextType(e.target.value));
  };

  const renderAuthButton = () => {
    if (signature.length > 0) {
      return (
        <FormControl>
          {" "}
          <FormLabel id="demo-radio-buttons-group-label"></FormLabel>{" "}
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue={signatureTextType}
            name="radio-buttons-group"
            onChange={handleSignatureType}
          >
            {" "}
            <FormControlLabel
              value="Rage"
              control={<Radio />}
              label={
                <Typography
                  style={{
                    "font-family": "Rage",
                    "font-size": "1.6rem",
                  }}
                >
                  {signature}
                </Typography>
              }
            />{" "}
            <FormControlLabel
              value="Mistral"
              control={<Radio />}
              label={
                <Typography
                  style={{
                    "font-family": "Mistral",
                    "font-size": "1.6rem",
                  }}
                >
                  {signature}
                </Typography>
              }
            />{" "}
            <FormControlLabel
              value='"1_Docusign"'
              control={<Radio />}
              label={
                <Typography
                  style={{
                    "font-family": '"1_Docusign"',
                    "font-size": "1.6rem",
                  }}
                >
                  {signature}
                </Typography>
              }
            />{" "}
            <FormControlLabel
              value='"2_Docusign"'
              control={<Radio />}
              label={
                <Typography
                  style={{
                    "font-family": '"2_Docusign"',
                    "font-size": "1.6rem",
                  }}
                >
                  {signature}
                </Typography>
              }
            />{" "}
            <FormControlLabel
              value='"3_Docusign"'
              control={<Radio />}
              label={
                <Typography
                  style={{
                    "font-family": '"3_Docusign"',
                    "font-size": "1.6rem",
                  }}
                >
                  {signature}
                </Typography>
              }
            />{" "}
            <FormControlLabel
              value='"4_Docusign"'
              control={<Radio />}
              label={
                <Typography
                  style={{
                    "font-family": '"4_Docusign"',
                    "font-size": "1.6rem",
                  }}
                >
                  {signature}
                </Typography>
              }
            />{" "}
            <FormControlLabel
              value='"5_Docusign"'
              control={<Radio />}
              label={
                <Typography
                  style={{
                    "font-family": '"5_Docusign"',
                    "font-size": "1.6rem",
                  }}
                >
                  {signature}
                </Typography>
              }
            />{" "}
            <FormControlLabel
              value='"6_Docusign"'
              control={<Radio />}
              label={
                <Typography
                  style={{
                    "font-family": '"6_Docusign"',
                    "font-size": "1.6rem",
                  }}
                >
                  {signature}
                </Typography>
              }
            />{" "}
            <FormControlLabel
              value='"7_Docusign"'
              control={<Radio />}
              label={
                <Typography
                  style={{
                    "font-family": '"7_Docusign"',
                    "font-size": "1.6rem",
                  }}
                >
                  {signature}
                </Typography>
              }
            />{" "}
            <FormControlLabel
              value='"8_Docusign"'
              control={<Radio />}
              label={
                <Typography
                  style={{
                    "font-family": '"8_Docusign"',
                    "font-size": "1.6rem",
                  }}
                >
                  {signature}
                </Typography>
              }
            />{" "}
          </RadioGroup>{" "}
        </FormControl>
      );
    } else {
      return;
    }
  };
  return (
    <div>
      <Box sx={{ textAlign: "center" }}>
        <Grid container spacing={1} style={{ marginTop: "1rem" }}>
          <Grid item xs={12} md={3} style={{ paddingTop: "25px" }}>
            <label htmlFor="name">Name:</label>
          </Grid>
          <Grid item xs={12} md={9}>
            <TextField
              id="name"
              type="text"
              label="Name"
              variant="outlined"
              size="small"
              value={name}
              onChange={handleNameChange}
            />
          </Grid>
        </Grid>
      </Box>

      <div>{renderAuthButton()}</div>
    </div>
  );
};

export default TextSignature;
