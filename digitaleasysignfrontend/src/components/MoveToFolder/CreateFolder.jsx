import Close from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Card,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { createFolderFunction } from "../../functions/folder";
import { useMessage } from "../Header/Header";
import { useUser } from "../../hooks/Authorize";

const CreateFolder = ({ open, handleClose, handleSuccess, folderId }) => {
  const [inputText, setInputText] = useState(undefined);
  const { showError, showSuccess } = useMessage();
  const user = useUser();
  /**onchange handller */
  const onInputChangeHandller = (e) => {
    const { value } = e.target;
    setInputText(value);
  };
  const onClickCreateFolder = async () => {
    try {
      const response = await createFolderFunction(
        inputText,
        folderId,
        user.fullName
      );
      if (response.status === 200) {
        showSuccess(response.message);
        handleSuccess();
        // setSmallModalopen(false);
      } else {
        showError(response.message);
      }
    } catch (error) {
      showError("Folder creation error.");
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Card
          sx={{
            boxShadow: "rgba(0, 0, 0, 0.45) 0px 25px 20px -20px",
            borderRadius: "8px",
            maxWidth: "449px",
            width: "100%",
            p: 3,
            m: 2,
            mt: 8,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Create Folder</Typography>
            <IconButton onClick={handleClose}>
              <Close sx={{ fontSize: "18px" }} />
            </IconButton>
          </Stack>
          <Box height={50}>
            <TextField
              fullWidth
              value={inputText}
              onChange={onInputChangeHandller}
              style={{ margin: "8px 0" }}
            />
          </Box>
          <Box sx={{ float: "right", marginTop: "25px" }}>
            <Button variant="text" sx={{ mr: 2 }} onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={!inputText}
              onClick={onClickCreateFolder}
            >
              Create
            </Button>
          </Box>
        </Card>
      </Modal>
    </>
  );
};

export default CreateFolder;
