import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog({ isOpen, onClose, onConfirm }) {
  //   const [open, setOpen] = React.useState(error);

  //   const handleClickOpen = () => {
  //     setOpen(true);
  //   };

  // const handleConfirm = () => {
  //   onConfirm();
  //   onClose();
  // };

  return (
    <React.Fragment>
      <Dialog
        open={isOpen}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {/* <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle> */}
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to open a new file?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>No</Button>
          <Button onClick={onConfirm} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}