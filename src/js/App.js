import React, { useState, useEffect, useRef } from 'react'
import Component from './Component'
import InputAdornment from '@material-ui/core/InputAdornment';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import MarkdownTranslatable from './MarkdownTranslatable';
import PrintPreview from "./PrintPreview";

// import AlertDialog from './Dialog';


import { Button, TextField } from '@mui/material';
const { dialog, shell } = require('@electron/remote')
const path = require('path');


import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { styled } from '@mui/material/styles';

// const Item = styled('div')(({ theme }) => ({
//   // backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
//   // ...theme.typography.body2,
//   padding: theme.spacing(1),
//   // textAlign: 'center',

// }));

var fs = require('fs');

export default function App() {

  // const [fileErrorDailog, setFileErrorDailog] = React.useState(false);
  // const [confirmFileError, setConfirmFileError] = React.useState(true);


  // const isOpenDialog = useRef(false);
  // const isValue = isOpenDialog.current;
  // const [isValue, setIsValue] = useState(false)

  const [fileName, setFileName] = useState("")

  const [sourceData, setSourceData] = useState("")
  const [targetData, setTargetData] = useState("")
  const [editedContent, setEditedContent] = useState("")
  const [resource, setResource] = useState("")
  const [loading, setLoading] = useState(false)
  const [filePath, setFilePath] = useState("");
  const [fileType, setFileType] = useState("");
  let resType

  const showInFolder = () => {
    if (filePath != "") {
      shell.showItemInFolder(filePath)
    }
  };


  // const handleFileOpenError = () => {
  //   setOpenFileError(true);
  // };

  // const handleFileCloseError = () => {
  //   setOpenFileError(false);
  // // };
  // useEffect(() => {
  //   selectFile()
  // }, [isOpenDialog]);

  const clearState = () => {
    // console.log("sssssssssssss")
    // isOpenDialog.current = false
    // setFileName('')

    // setSourceData("");
    // setTargetData("");
    // setResource("");
    // setLoading("");
    // setFilePath("");
    // setFileType("");

  }

  const saveEditedContent = (content) => {
    setEditedContent(content)
  }

  const selectFile = () => {
    // setIsOpenDialog(false)
    if (fileName) {
      console.log('iiiiiiiiii', isOpenDialog.current)
      // isOpenDialog.current = true;
      // setIsValue(true)
      console.log('eeeeeeeeeeeee', isOpenDialog.current)
      // console.log("bbbbb")
    } else {
      clearState()
      // console.log("aaaaaaaaaaaa")
      dialog.showOpenDialog({
        defaultPath: path.join(__dirname, 'src', 'assets', 'Resources'),
      }).then(
        result => {
          setLoading(true)
          let file = result.filePaths[0].split(".")[0];

          if (result.filePaths[0].includes("en_tn")) {
            resType = "en_tn"
            setResource("en_tn")
          } else if (result.filePaths[0].includes("en_tq")) {
            resType = "en_tq"
            setResource("en_tq")

          } else if (result.filePaths[0].includes("en_obs")) {
            resType = "en_obs"
            setResource("en_obs")
          }

          setFileName(file.substring(file.length - 3, file.length));
          if (!result.canceled) {
            let sourceFilePath = result.filePaths[0]
            let fType = result.filePaths[0].split('.');
            setFileType(fType[1])

            document.getElementById("actual-file").value = sourceFilePath.split("Resources/")[1];

            let fileInOutputName
            let targetFilePath
            if (resType === 'en_tn') {
              fileInOutputName = result.filePaths[0].replace(`Resources/${resType}-release_v77`, "Output")
              targetFilePath = (fs.existsSync(fileInOutputName) ? fileInOutputName : result.filePaths[0]);
              document.getElementById("target-file").value = targetFilePath.includes("Resources") ? targetFilePath.split("Resources/")[1] : targetFilePath.split("assets/")[1];
            } else if (resType === 'en_obs') {
              fileInOutputName = result.filePaths[0].replace(`Resources/${resType}-v9`, "Output")
              targetFilePath = (fs.existsSync(fileInOutputName) ? fileInOutputName : result.filePaths[0]);
              document.getElementById("target-file").value = targetFilePath.includes("Resources") ? targetFilePath.split("Resources/")[1] : targetFilePath.split("assets/")[1];
            }
            let data = fs.readFileSync(sourceFilePath,
              { encoding: 'utf8', flag: 'r' })
            setSourceData(data);
            if (sourceFilePath === targetFilePath) {
              setTargetData(data)
            }
            else if ((sourceFilePath !== targetFilePath)) {
              let targetdata = fs.readFileSync(targetFilePath,
                { encoding: 'utf8', flag: 'r' })
              setTargetData(targetdata)
            }
            setFilePath(targetFilePath)
            setLoading(false);
          }
        }).catch(err => {
          console.log(err)
        })
    }

  }


  // const handleDialogClose = () => {
  //   isOpenDialog.current = false;
  // };

  // const handleDialogConfirm = () => {
  //   // alert(`File ${fileName} opened again`);
  //   // setIsOpenDialog(false)
  //   // selectFile()
  //   clearState()
  //   selectFile()
  // };

  // const onClickDailogMsg = (value)=>{
  //   setConfirmFileError(value)
  //   setFileErrorDailog(false)
  // }
  // console.log({ fileName, isValue })
  // console.log('reffff', isOpenDialog.current)


  const saveFile = () => {
    let filepath1 = filePath.includes("Resources/") ? filePath.replace(`Resources/${resource}-v9`, "Output") : filePath
    fs.writeFile(filepath1, editedContent, function (err) {
      if (err) {
        alert("An error ocurred updating the file" + err.message);
        console.log(err);
        return;
      }
      setTranslation(_translation);

      console.log("The file has been successfully saved");

    });
  }


  console.log({ fileName, sourceData, targetData, resource, loading, filePath, fileType, editedContent })

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={4}>

        <Grid item xs={6} md={6}>
          <Button variant="contained" size='small' color="primary" id="select-file" onClick={() => selectFile()}>
            Open File
          </Button>
        </Grid>
        <Grid item xs={6} md={6}>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <PrintPreview filePath={filePath} fileName={fileName} fileType={fileType} targetData={targetData} />
            </Grid>
            <Grid item xs={6}>
              <Button variant="contained" size='small' color="primary" onClick={saveFile}>
                Save File
              </Button>
            </Grid>
          </Grid>
        </Grid>
        {/* {isValue &&
          <AlertDialog isOpen={isValue}
          onClose={handleDialogClose}
          onConfirm={handleDialogConfirm} />
        } */}


        <Grid xs={6} md={6}>
          <TextField
            disabled
            defaultValue="Please select a resource"
            id="actual-file"
            label="Source File"
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid xs={6} md={6}>
          <TextField
            disabled
            defaultValue="Please select the source file"
            id="target-file"
            label="Target File"
            variant="outlined"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <FolderOpenIcon color='primary' onClick={showInFolder} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid xs={12} md={12} style={{ border: '1px black solid', margin: '15px' }}>
          {(sourceData?.length > 0 && targetData?.length > 0 && loading === false) ?
            (

              fileType === 'tsv' ?
                <Component sourceData={sourceData} targetData={targetData} fileName={fileName} resource={resource} filePath={filePath} fileType={fileType} onSaveEdited={saveEditedContent} />
                :
                <MarkdownTranslatable sourceData={sourceData} targetData={targetData} fileName={fileName} resource={resource} filePath={filePath} fileType={fileType} onSaveEdited={saveEditedContent} />)
            : "Please select a file"}

        </Grid>

      </Grid>

    </Box>

  )
}
