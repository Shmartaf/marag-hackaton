import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const CustomModal = ({ isOpen, onClose, children }) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Product Information</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomModal;
