import React, { useState } from 'react'
import Component from './Component'
const path = require('path');
const { dialog, shell } = require('@electron/remote')
import TextField from '@material-ui/core/TextField';
// import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import MarkdownTranslatable from './MarkdownTranslatable';
// import { styled } from '@material-ui/styles';
// import { Grid, Item } from '@material-ui/core';
// import Box from '@material-ui/core';
// import Paper from '@material-ui/core';
// import { createTheme } from '@material-ui/core';
// import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2


import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { styled } from '@mui/material/styles';
// import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

var fs = require('fs');

// const Item = styled(Paper)(({ createTheme }) => ({
//   backgroundColor: createTheme.palette.mode === 'dark' ? '#1A2027' : '#fff',
//   ...createTheme.typography.body2,
//   padding: createTheme.spacing(1),
//   textAlign: 'center',
//   color: createTheme.palette.text.secondary,
// }));


export default function App() {

  const [sourceData, setSourceData] = useState("")
  const [targetData, setTargetData] = useState("")
  const [fileName, setFileName] = useState("")
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

  const clearState = () => {
    console.log("sssssssssssss")
    setSourceData("");
    setTargetData("");
    setFileName("");
    setResource("");
    setLoading("");
    setFilePath("");
    setFileType("");

  }

  const selectFile = () => {
    clearState()
    console.log("aaaaaaaaaaaa")
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
  // window.onload = function () {
  //   clearState()
  //   document.getElementById('select-file').addEventListener('click', function () {
  //     dialog.showOpenDialog({
  //       defaultPath: path.join(__dirname, 'src', 'assets', 'Resources'),
  //     }).then(

  //       result => {

  //         setLoading(true)
  //         let file = result.filePaths[0].split(".")[0];
  //         if (result.filePaths[0].includes("en_tn")) {
  //           resType = "en_tn"
  //           setResource("en_tn")
  //         } else if (result.filePaths[0].includes("en_tq")) {
  //           resType = "en_tq"
  //           setResource("en_tq")

  //         } else if (result.filePaths[0].includes("en_obs")) {
  //           resType = "en_obs"
  //           setResource("en_obs")

  //         }

  //         setFileName(file.substring(file.length - 3, file.length));
  //         if (!result.canceled) {
  //           let sourceFilePath = result.filePaths[0]
  //           let fType = result.filePaths[0].split('.');
  //           setFileType(fType[1])

  //           document.getElementById("actual-file").value = sourceFilePath.split("Resources/")[1];

  //           let fileInOutputName
  //           let targetFilePath
  //           if (resType === 'en_tn') {
  //             fileInOutputName = result.filePaths[0].replace(`Resources/${resType}-release_v77`, "Output")
  //             targetFilePath = (fs.existsSync(fileInOutputName) ? fileInOutputName : result.filePaths[0]);
  //             document.getElementById("target-file").value = targetFilePath.includes("Resources") ? targetFilePath.split("Resources/")[1] : targetFilePath.split("assets/")[1];
  //           } else if (resType === 'en_obs') {
  //             fileInOutputName = result.filePaths[0].replace(`Resources/${resType}-v9`, "Output")
  //             targetFilePath = (fs.existsSync(fileInOutputName) ? fileInOutputName : result.filePaths[0]);
  //             document.getElementById("target-file").value = targetFilePath.includes("Resources") ? targetFilePath.split("Resources/")[1] : targetFilePath.split("assets/")[1];
  //           }
  //           let data = fs.readFileSync(sourceFilePath,
  //             { encoding: 'utf8', flag: 'r' })
  //           setSourceData(data);
  //           if (sourceFilePath === targetFilePath) {
  //             setTargetData(data)
  //           }
  //           else if ((sourceFilePath !== targetFilePath)) {
  //             let targetdata = fs.readFileSync(targetFilePath,
  //               { encoding: 'utf8', flag: 'r' })
  //             setTargetData(targetdata)
  //           }
  //           setFilePath(targetFilePath)
  //           setLoading(false);
  //         }
  //       }).catch(err => {
  //         console.log(err)
  //       })

  //   }, false);
  // }

  return (
    
    <div style={{ width: '100%', height:'950px', border: '2px black solid' }} >

      <div style={{ width: '100%', border: '1px black solid' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '80px', marginTop: '30px', marginBottom: '30px' }}>
          <div style={{ width: '40%', height: '100%', padding: 'auto', alignItems: 'center' }}>

            <TextField
              disabled
              defaultValue="Please select a resource"
              id="actual-file"
              label="Source File"
              variant="outlined"
              fullWidth
            />

            <Button variant="contained" color="primary" id="select-file" onClick={()=>selectFile()} style={{ margin: '10px' }}>
              Choose a file
            </Button>

          </div>
          <div style={{ width: '40%', height: '100%', marginLeft: '10px' }}>
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

          </div>
        </div>

      </div>

      <div style={{ width: '100%', border: '1px black solid' }}>
        {(sourceData?.length > 0 && targetData?.length > 0 && loading === false) ?
          (

            fileType === 'tsv' ?
              <Component sourceData={sourceData} targetData={targetData} fileName={fileName} resource={resource} filePath={filePath} fileType={fileType} />
              :
              <MarkdownTranslatable sourceData={sourceData} targetData={targetData} resource={resource} filePath={filePath} fileType={fileType} />)
          : "Please select a file"}


      </div>
      </div>

  )
}
