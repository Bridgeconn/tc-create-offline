import React, { useState, useRef } from 'react'
import Component from './Component'
import InputAdornment from '@material-ui/core/InputAdornment';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import MarkdownTranslatable from './MarkdownTranslatable';
import PrintPreview from "./PrintPreview";
import AlertDialog from './Dialog';
import { Button, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

const { dialog, shell } = require('@electron/remote')
const path = require('path');
var fs = require('fs');

export default function App() {

  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [fileName, setFileName] = useState("")
  const [sourceData, setSourceData] = useState("")
  const [targetData, setTargetData] = useState("")
  const [resource, setResource] = useState("")
  const [loading, setLoading] = useState(false)
  const [filePath, setFilePath] = useState("");
  const [fileType, setFileType] = useState("");
  let resType
  // const fileInputRef = useRef(null);



  const showInFolder = () => {
    if (filePath != "") {
      shell.showItemInFolder(filePath)
    }
  };



  const clearState = () => {
    setFileName("")
    setSourceData("");
    setTargetData("");
    setResource("");
    setLoading(false);
    setFilePath("");
    setFileType("");
    document.getElementById("actual-file").value = "Please select a resource"
    document.getElementById("target-file").value = "Please select the source file"
  }

  // const handleClick = () => {
  //   fileInputRef.current.click();
  // };

  // const ss = (event) => {
  //   const selectedFile = event.target.files[0];
  //   // Process the selected file (e.g., display its name in a modal on top)
  //   let file = selectedFile.path.split('.')
  //   console.log({ selectedFile, file });
  // };

  const handleChange = () => {
    if (fileName) {
      setIsOpenDialog(true)
    } else {
      clearState()
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
          let _fileName = file.substring(file.length - 3, file.length)
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
            let newData = data.replaceAll('https://cdn.door43.org/obs/jpg/360px', `file:///home/bcs04/UW/BCS-UW/uw-lab/tc-create-offline-poc/src/assets/images${_fileName}`)
            // data.replace('', `file:///home/bcs04/UW/BCS-UW/uw-lab/tc-create-offline-poc/src/assets/images/${2}`)
            // console.log("ppppp", newData)
            setSourceData(newData);

            if (sourceFilePath === targetFilePath) {
              setTargetData(newData)
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
        }
        )
    }
  }


  const handleDialogClose = () => {
    setIsOpenDialog(false)
  };

  const handleDialogConfirm = () => {
    clearState()
    if (!loading) {
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
          let _fileName = file.substring(file.length - 3, file.length)
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
            let newData = data.replaceAll('https://cdn.door43.org/obs/jpg/360px', `file:///home/bcs04/UW/BCS-UW/uw-lab/tc-create-offline-poc/src/assets/images${_fileName}`)
            // data.replace('', `file:///home/bcs04/UW/BCS-UW/uw-lab/tc-create-offline-poc/src/assets/images/${2}`)
            // console.log("ppppp", newData)
            setSourceData(newData);

            if (sourceFilePath === targetFilePath) {
              setTargetData(newData)
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
        }
        )

      setIsOpenDialog(false)
    }

  };
  // console.log('++++++++++++++', fileName)
  // console.log({ fileName, sourceData, targetData, resource, loading, filePath, fileType, editedContent })

  return (
    <Box sx={{ width: '100%', position: 'fixed', top: 0, left: 0 }}>
      <Grid container spacing={4} style={{ overflow: 'hidden', paddingBottom: '50px' }}>

        <Grid item xs={6} md={6}>
          <Button style={{ marginLeft: '5px' }} variant="contained" size='small' color="primary" id="select-file" onClick={handleChange}>
            Open File
          </Button>
          {/* <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={handleChange} /> */}
        </Grid>
        <Grid item xs={6} md={6}>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <PrintPreview filePath={filePath} fileName={fileName} fileType={fileType} targetData={targetData} />
            </Grid>
          </Grid>
        </Grid>

        {
          isOpenDialog &&
          <AlertDialog
            isOpen={isOpenDialog}
            onClose={handleDialogClose}
            onConfirm={handleDialogConfirm}
          />
        }

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
        <Grid xs={12} md={12} style={{ border: '1px black solid', margin: '20px' }}>
          <div style={{ overflowY: 'auto', maxHeight: 'calc(88vh - 64px - 15px)' }}>
            {(sourceData?.length > 0 && targetData?.length > 0 && loading === false) ?
              (
                fileType === 'tsv' ?
                  <Component sourceData={sourceData} targetData={targetData} fileName={fileName} resource={resource} filePath={filePath} fileType={fileType} />
                  :
                  // <MdOffline sourceData={sourceData} targetData={targetData} fileName={fileName} resource={resource} filePath={filePath} fileType={fileType} />
                  <MarkdownTranslatable sourceData={sourceData} targetData={targetData} fileName={fileName} resource={resource} filePath={filePath} fileType={fileType} />
              )
              : "Please select a file"}
          </div>
        </Grid>

      </Grid>

    </Box>

  )
}
