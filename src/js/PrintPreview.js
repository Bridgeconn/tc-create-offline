import React, { useRef } from 'react';
import { withStyles } from '@material-ui/core/styles';
// import Button from '@material-ui/core/Button';
import {Button} from '@mui/material';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { useReactToPrint } from 'react-to-print';
import ReactMarkdown from 'react-markdown';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;

  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function PrintPreview({ filePath, fileName, fileType, targetData }) {
  const [open, setOpen] = React.useState(false);
  const [previewData, setPreviewData] = React.useState("")
  // Importing the necessary modules
  const Papa = require('papaparse');
  const columnName = 'Note';
  // Function to read a specific column from a TSV file
  function readColumn(filePath, columnName, callback) {
    // Fetch the TSV file
    fetch(filePath)
      .then(response => response.text())
      .then(data => {
        // Parse the TSV content using PapaParse

        Papa.parse(data, {
          delimiter: '\t', // Set the delimiter to tab for TSV files
          header: false,    // Treat the first row as headers
          dynamicTyping: true, // Automatically convert values to appropriate types
          complete: function (results) {
            const columnValues = results.data.map(row => {
              if (row[6] !== undefined) { return `**${fileName} ${row[0]}**\n\n ${row[6]}` }
            });
            callback(columnValues);
          },
        });
      })
      .catch(error => {
        console.error('Error reading file:', error);
      });
  }


  readColumn(filePath, columnName, function (columnValues) {
    columnValues.shift()
    let values = columnValues
    let p = values.join('\n\n')
    setPreviewData(p)
  });


  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,

  });

  console.log("mmmmmmmmmmmmmmmmmmm", fileType)

  return (
    <div>
      <Button variant="contained" size='small' color="primary" onClick={handleClickOpen}>
        Print
      </Button>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth={'lg'}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Preview
        </DialogTitle>
        <DialogContent dividers>

          <div style={{}}>
            <div className="note" ref={componentRef} style={{ margin: 90, textAlign: 'justify' }}>
              {fileType === 'tsv' ?
               <ReactMarkdown>{previewData.replace(/\\n/g, '\n')}</ReactMarkdown> :
               <ReactMarkdown>{targetData}</ReactMarkdown>
               }
            </div>
          </div>

        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handlePrint} color="primary">
            Print
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
