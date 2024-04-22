import React, { useState, useRef, useEffect } from "react";
import Component from "./Component";
import InputAdornment from "@material-ui/core/InputAdornment";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import MarkdownTranslatable from "./MarkdownTranslatable";
import PrintPreview from "./PrintPreview";
import AlertDialog from "./Dialog";
import { Button, TextField, CircularProgress, Chip } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2

const { dialog, shell } = require("@electron/remote");
const path = require("path");
var fs = require("fs");
const os = require("os");
const homeDir = os.homedir();

export default function App() {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [fileName, setFileName] = useState("");
  const [sourceData, setSourceData] = useState("");
  const [targetData, setTargetData] = useState("");
  const [resource, setResource] = useState("");
  const [loading, setLoading] = useState(false);
  const [filePath, setFilePath] = useState("");
  const [fileType, setFileType] = useState("");
  // const [targetFilePath, setTargetFilePath] = useState("")
  let resType;
  // const fileInputRef = useRef(null);

  const showInFolder = () => {
    if (filePath != "") {
      shell.showItemInFolder(filePath);
    }
  };
  // let targetFilePath;
  useEffect(() => {
    if (filePath) {
      document.getElementById("target-file").value = filePath.includes(
        "Resources"
      )
        ? filePath.split("assets/Resources/")[1]
        : filePath.split("tc-create/")[1];
    } else {
      document.getElementById("target-file").value = "Please select the Source";
    }
  }, [filePath]);

  const clearState = () => {
    setFileName("");
    setSourceData("");
    setTargetData("");
    setResource("");
    setLoading(false);
    setFilePath("");
    setFileType("");
    document.getElementById("actual-file").value = "Please select a resource";
    document.getElementById("target-file").value =
      "Please select the source file";
  };

  const handleChange = () => {
    if (fileName) {
      setIsOpenDialog(true);
    } else {
      dialog
        .showOpenDialog({
          defaultPath: path.join(__dirname, "..", "src", "assets", "Resources"),
        })
        .then((result) => {
          setLoading(true);
          let file = result.filePaths[0].split(".md")[0];
          const fileExtension = result.filePaths[0].split(".").pop();
          if (fileExtension !== "md" && fileExtension !== "tsv") {
            // Show message that only TSV and MD files are allowed
            alert("Only TSV and MD files are supported.");
            setLoading(false);
            return;
          } else if (result.filePaths[0].includes("en_tn")) {
            resType = "tn";
            setResource("en_tn");
          }
          //  else if (result.filePaths[0].includes("en_tq")) {
          //   resType = "tq";
          //   setResource("en_tq");
          // } else if (result.filePaths[0].includes("en_twl")) {
          //   resType = "twl";
          //   setResource("en_twl");
          // }else if (result.filePaths[0].includes("en_tw")) {
          //   resType = "tw";
          //   setResource("en_tw");
          // } else if (result.filePaths[0].includes("en_ta")) {
          //   resType = "ta";
          //   setResource("en_ta");
          // } else if (result.filePaths[0].includes("en_obs-tn")) {
          //   resType = "obs_tn";
          //   setResource("en_obs_tn");
          // } else if (result.filePaths[0].includes("en_obs-tq")) {
          //   resType = "obs_tq";
          //   setResource("en_obs_tq");
          // } else if (result.filePaths[0].includes("en_obs-sn")) {
          //   resType = "obs_sn";
          //   setResource("en_obs_sn");
          // } else if (result.filePaths[0].includes("en_obs-sq")) {
          //   resType = "obs_sq";
          //   setResource("en_obs_sq");
          // }
          else if (result.filePaths[0].includes("en_obs")) {
            resType = "obs";
            setResource("en_obs");
          }
          let _fileName = file.substring(file.length - 3, file.length);
          setFileName(file.substring(file.length - 3, file.length));

          if (!result.canceled) {
            let sourceFilePath = result.filePaths[0];
            let fType = result.filePaths[0].split(".").pop();
            setFileType(fType);

            document.getElementById("actual-file").value =
              sourceFilePath.split("assets/Resources/")[1];

            let fileInOutputName;
            let targetFilePath;
            if (resType === "tn") {
              fileInOutputName = path.join(
                homeDir,
                "tc-create",
                "Output",
                "tn",
                result.filePaths[0].split("en_tn-release_v77/en_tn")[1]
              );
              targetFilePath = fs.existsSync(fileInOutputName)
                ? fileInOutputName
                : result.filePaths[0];
            }
            //  else if (resType === "obs_sn") {
            //   fileInOutputName = path.join(
            //     homeDir,
            //     "tc-create",
            //     "Output",
            //     "obs-sn",
            //     result.filePaths[0].split("en_obs-sn-v5/en_obs-sn")[1]
            //   );
            //   targetFilePath = fs.existsSync(fileInOutputName)
            //     ? fileInOutputName
            //     : result.filePaths[0];
            // } else if (resType === "obs_sq") {
            //   fileInOutputName = path.join(
            //     homeDir,
            //     "tc-create",
            //     "Output",
            //     "obs-sq",
            //     result.filePaths[0].split("en_obs-sq-v4/en_obs-sq")[1]
            //   );
            //   targetFilePath = fs.existsSync(fileInOutputName)
            //     ? fileInOutputName
            //     : result.filePaths[0];
            // } else if (resType === "obs_tn") {
            //   fileInOutputName = path.join(
            //     homeDir,
            //     "tc-create",
            //     "Output",
            //     "obs-tn",
            //     result.filePaths[0].split("en_obs-tn-v12/en_obs-tn")[1]
            //   );
            //   targetFilePath = fs.existsSync(fileInOutputName)
            //     ? fileInOutputName
            //     : result.filePaths[0];
            // } else if (resType === "obs_tq") {
            //   fileInOutputName = path.join(
            //     homeDir,
            //     "tc-create",
            //     "Output",
            //     "obs-tq",
            //     result.filePaths[0].split("en_obs-tq-v9/en_obs-tq")[1]
            //   );
            //   targetFilePath = fs.existsSync(fileInOutputName)
            //     ? fileInOutputName
            //     : result.filePaths[0];
            // } else if (resType === "tq") {
            //   fileInOutputName = path.join(
            //     homeDir,
            //     "tc-create",
            //     "Output",
            //     "tq",
            //     result.filePaths[0].split("en_tq-release_v77/en_tq")[1]
            //   );
            //   targetFilePath = fs.existsSync(fileInOutputName)
            //     ? fileInOutputName
            //     : result.filePaths[0];
            // } else if (resType === "twl") {
            //   fileInOutputName = path.join(
            //     homeDir,
            //     "tc-create",
            //     "Output",
            //     "twl",
            //     result.filePaths[0].split("en_twl-release_v77/en_twl")[1]
            //   );
            //   targetFilePath = fs.existsSync(fileInOutputName)
            //     ? fileInOutputName
            //     : result.filePaths[0];
            // }else if (resType === "tw") {
            //   fileInOutputName = path.join(
            //     homeDir,
            //     "tc-create",
            //     "Output",
            //     "tw",
            //     result.filePaths[0].split("en_tw-release_v77/en_tw")[1]
            //   );
            //   targetFilePath = fs.existsSync(fileInOutputName)
            //     ? fileInOutputName
            //     : result.filePaths[0];
            // }  else if (resType === "ta") {
            //   fileInOutputName = path.join(
            //     homeDir,
            //     "tc-create",
            //     "Output",
            //     "ta",
            //     result.filePaths[0].split("en_ta-release_v77/en_ta")[1]
            //   );
            //   targetFilePath = fs.existsSync(fileInOutputName)
            //     ? fileInOutputName
            //     : result.filePaths[0];
            // }
            else if (resType === "obs") {
              fileInOutputName = path.join(
                homeDir,
                "tc-create",
                "Output",
                "obs",
                result.filePaths[0].split("en_obs-v9/en_obs")[1]
              );
              targetFilePath = fs.existsSync(fileInOutputName)
                ? fileInOutputName
                : result?.filePaths[0];
              // document.getElementById("target-file").value =
              //   targetFilePath.includes("Resources")
              //     ? targetFilePath.split("Resources/")[1]
              //     : targetFilePath.split("tc-create/")[1];
            }
            let data = fs.readFileSync(sourceFilePath, {
              encoding: "utf8",
              flag: "r",
            });
            const directoryPath = path.join(
              __dirname,
              "..",
              "src",
              "assets",
              "images"
            );

            // Append the _fileName to the directory path
            const filePath = path.join(directoryPath, _fileName);
            let newData = data.replaceAll(
              "https://cdn.door43.org/obs/jpg/360px",
              `file://${filePath}`
            );

            // data.replace('', `file:///home/bcs04/UW/BCS-UW/uw-lab/tc-create-offline-poc/src/tc-create/images/${2}`)
            setSourceData(newData);
            if (sourceFilePath === targetFilePath) {
              setTargetData(newData);
            } else if (sourceFilePath !== targetFilePath) {
              let targetdata = fs.readFileSync(targetFilePath, {
                encoding: "utf8",
                flag: "r",
              });
              setTargetData(targetdata);
            }
            setFilePath(targetFilePath);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  const handleDialogClose = () => {
    setIsOpenDialog(false);
  };

  const handleDialogConfirm = () => {
    clearState();
    if (!loading) {
      dialog
        .showOpenDialog({
          defaultPath: path.join(__dirname, "..", "src", "assets", "Resources"),
        })
        .then((result) => {
          setLoading(true);
          let file = result.filePaths[0].split(".")[0];
          const fileExtension = result.filePaths[0].split(".").pop();
          if (fileExtension !== "md" && fileExtension !== "tsv") {
            // Show message that only TSV and MD files are allowed
            alert("Only TSV and MD files are supported.");
            setLoading(false);
            return;
          } else if (result.filePaths[0].includes("en_tn")) {
            resType = "tn";
            setResource("en_tn");
          }
          //  else if (result.filePaths[0].includes("en_tq")) {
          //   resType = "tq";
          //   setResource("en_tq");
          // } else if (result.filePaths[0].includes("en_twl")) {
          //   resType = "twl";
          //   setResource("en_twl");
          // } else if (result.filePaths[0].includes("en_tw")) {
          //   resType = "tw";
          //   setResource("en_tw");
          // } else if (result.filePaths[0].includes("en_ta")) {
          //   resType = "ta";
          //   setResource("en_ta");
          // } else if (result.filePaths[0].includes("en_obs-tn")) {
          //   resType = "obs_tn";
          //   setResource("en_obs_tn");
          // } else if (result.filePaths[0].includes("en_obs-tq")) {
          //   resType = "obs_tq";
          //   setResource("en_obs_tq");
          // } else if (result.filePaths[0].includes("en_obs-sn")) {
          //   resType = "obs_sn";
          //   setResource("en_obs_sn");
          // } else if (result.filePaths[0].includes("en_obs-sq")) {
          //   resType = "obs_sq";
          //   setResource("en_obs_sq");
          // }
          else if (result.filePaths[0].includes("en_obs")) {
            resType = "obs";
            setResource("en_obs");
          }
          let _fileName = file.substring(file.length - 3, file.length);
          setFileName(file.substring(file.length - 3, file.length));

          if (!result.canceled) {
            let sourceFilePath = result.filePaths[0];
            let fType = result.filePaths[0].split(".").pop();
            setFileType(fType);

            document.getElementById("actual-file").value =
              sourceFilePath.split("assets/Resources/")[1];

            let fileInOutputName;
            let targetFilePath;
            if (resType === "tn") {
              fileInOutputName = path.join(
                homeDir,
                "tc-create",
                "Output",
                "tn",
                result.filePaths[0].split("en_tn-release_v77/en_tn")[1]
              );
              targetFilePath = fs.existsSync(fileInOutputName)
                ? fileInOutputName
                : result.filePaths[0];
            }
            //  else if (resType === "obs_sn") {
            //   fileInOutputName = path.join(
            //     homeDir,
            //     "tc-create",
            //     "Output",
            //     "obs-sn",
            //     result.filePaths[0].split("en_obs-sn-v5/en_obs-sn")[1]
            //   );
            //   targetFilePath = fs.existsSync(fileInOutputName)
            //     ? fileInOutputName
            //     : result.filePaths[0];
            // } else if (resType === "obs_sq") {
            //   fileInOutputName = path.join(
            //     homeDir,
            //     "tc-create",
            //     "Output",
            //     "obs-sq",
            //     result.filePaths[0].split("en_obs-sq-v4/en_obs-sq")[1]
            //   );
            //   targetFilePath = fs.existsSync(fileInOutputName)
            //     ? fileInOutputName
            //     : result.filePaths[0];
            // } else if (resType === "obs_tn") {
            //   fileInOutputName = path.join(
            //     homeDir,
            //     "tc-create",
            //     "Output",
            //     "obs-tn",
            //     result.filePaths[0].split("en_obs-tn-v12/en_obs-tn")[1]
            //   );
            //   targetFilePath = fs.existsSync(fileInOutputName)
            //     ? fileInOutputName
            //     : result.filePaths[0];
            // } else if (resType === "obs_tq") {
            //   fileInOutputName = path.join(
            //     homeDir,
            //     "tc-create",
            //     "Output",
            //     "obs-tq",
            //     result.filePaths[0].split("en_obs-tq-v9/en_obs-tq")[1]
            //   );
            //   targetFilePath = fs.existsSync(fileInOutputName)
            //     ? fileInOutputName
            //     : result.filePaths[0];
            // } else if (resType === "tq") {
            //   fileInOutputName = path.join(
            //     homeDir,
            //     "tc-create",
            //     "Output",
            //     "tq",
            //     result.filePaths[0].split("en_tq-release_v77/en_tq")[1]
            //   );
            //   targetFilePath = fs.existsSync(fileInOutputName)
            //     ? fileInOutputName
            //     : result.filePaths[0];
            // } else if (resType === "twl") {
            //   fileInOutputName = path.join(
            //     homeDir,
            //     "tc-create",
            //     "Output",
            //     "twl",
            //     result.filePaths[0].split("en_twl-release_v77/en_twl")[1]
            //   );
            //   targetFilePath = fs.existsSync(fileInOutputName)
            //     ? fileInOutputName
            //     : result.filePaths[0];

            // } else if (resType === "tw") {
            //   fileInOutputName = path.join(
            //     homeDir,
            //     "tc-create",
            //     "Output",
            //     "tw",
            //     result.filePaths[0].split("en_tw-release_v77/en_tw")[1]
            //   );
            //   targetFilePath = fs.existsSync(fileInOutputName)
            //     ? fileInOutputName
            //     : result.filePaths[0];
            // } else if (resType === "ta") {
            //   fileInOutputName = path.join(
            //     homeDir,
            //     "tc-create",
            //     "Output",
            //     "ta",
            //     result.filePaths[0].split("en_ta-release_v77/en_ta")[1]
            //   );
            //   targetFilePath = fs.existsSync(fileInOutputName)
            //     ? fileInOutputName
            //     : result.filePaths[0];
            //}
            else if (resType === "obs") {
              fileInOutputName = path.join(
                homeDir,
                "tc-create",
                "Output",
                "obs",
                result.filePaths[0].split("en_obs-v9/en_obs")[1]
              );
              targetFilePath = fs.existsSync(fileInOutputName)
                ? fileInOutputName
                : result?.filePaths[0];
              // document.getElementById("target-file").value =
              //   targetFilePath.includes("Resources")
              //     ? targetFilePath.split("Resources/")[1]
              //     : targetFilePath.split("tc-create/")[1];
            }
            let data = fs.readFileSync(sourceFilePath, {
              encoding: "utf8",
              flag: "r",
            });
            const directoryPath = path.join(
              __dirname,
              "..",
              "src",
              "assets",
              "images"
            );

            // Append the _fileName to the directory path
            const filePath = path.join(directoryPath, _fileName);
            let newData = data.replaceAll(
              "https://cdn.door43.org/obs/jpg/360px",
              `file://${filePath}`
            );
            // data.replace('', `file:///home/bcs04/UW/BCS-UW/uw-lab/tc-create-offline-poc/src/tc-create/images/${2}`)
            setSourceData(newData);

            if (sourceFilePath === targetFilePath) {
              setTargetData(newData);
            } else if (sourceFilePath !== targetFilePath) {
              let targetdata = fs.readFileSync(targetFilePath, {
                encoding: "utf8",
                flag: "r",
              });
              setTargetData(targetdata);
            }
            setFilePath(targetFilePath);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
      setIsOpenDialog(false);
    }
  };

  return (
    <Box
      sx={{ width: "100%", height: "100%", position: "fixed", top: 0, left: 0 }}
    >
      <Grid
        container
        spacing={4}
        style={{ overflow: "hidden", paddingBottom: "50px", marginTop: "10px" }}
      >
        <div style={{ width: "100%", display: "block" }}>
          <div
            style={{
              width: "95%",
              display: "flex",
              flexDirection: "row",
              margin: "auto",
              alignItems: "center",
            }}
          >
            <Grid item xs={6} md={6}>
              <Button
                style={{ marginLeft: "5px" }}
                variant="contained"
                size="small"
                color="primary"
                id="select-file"
                onClick={handleChange}
              >
                Open File
              </Button>
              {/* <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={handleChange} /> */}
            </Grid>
            <Grid item xs={6} md={6}>
              {/* <Grid container spacing={2}> */}
              <Grid item xs={6}>
                <PrintPreview
                  filePath={filePath}
                  fileName={fileName}
                  fileType={fileType}
                  targetData={targetData}
                />
              </Grid>
              {/* </Grid> */}
            </Grid>

            {isOpenDialog && (
              <AlertDialog
                isOpen={isOpenDialog}
                onClose={handleDialogClose}
                onConfirm={handleDialogConfirm}
              />
            )}
          </div>
        </div>
        <div style={{ width: "100%", display: "block" }}>
          <div
            style={{
              width: "95%",
              display: "flex",
              flexDirection: "row",
              margin: "auto",
            }}
          >
            <Grid xs={6} md={6}>
              <TextField
                disabled
                defaultValue="Please select a resource"
                id="actual-file"
                label="Source File"
                variant="outlined"
                fullWidth
                // style={{ marginLeft: '5px' }}
              />
            </Grid>
            <Grid xs={6} md={6}>
              <TextField
                disabled
                // defaultValue="Please select the source file"
                id="target-file"
                label="Target File"
                variant="outlined"
                fullWidth
                // style={{ marginRight: '5px' }}

                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <FolderOpenIcon color="primary" onClick={showInFolder} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </div>
        </div>

        <Chip
          label="Source"
          color="secondary"
          size="small"
          style={{ marginLeft: "5%" }}
        />
        <Chip
          label="Target"
          color="secondary"
          size="small"
          style={{ marginLeft: "43%" }}
        />

        {loading ? (
          <div style={{ marginLeft: "450px", marginTop: "350px" }}>
            <CircularProgress />
          </div>
        ) : (
          <Grid
            xs={12}
            md={12}
            style={{ border: "1px black solid", margin: "20px" }}
          >
            <div
              style={{
                overflowY: "auto",
                maxHeight: "calc(75vh - 64px - 15px)",
                //  maxHeight: "calc(65vh - 64px - 15px)",

                minHeight: "500px",
                //  minHeight: "300px",
              }}
            >
              {sourceData?.length > 0 &&
              targetData?.length > 0 &&
              filePath !== undefined &&
              loading === false ? (
                fileType === "tsv" ? (
                  <Component
                    sourceData={sourceData}
                    targetData={targetData}
                    fileName={fileName}
                    resource={resource}
                    filePath={filePath}
                    fileType={fileType}
                    setFilePath={setFilePath}
                    setTargetData={setTargetData}
                  />
                ) : (
                  // <MdOffline sourceData={sourceData} targetData={targetData} fileName={fileName} resource={resource} filePath={filePath} fileType={fileType} />
                  <MarkdownTranslatable
                    sourceData={sourceData}
                    targetData={targetData}
                    fileName={fileName}
                    resource={resource}
                    filePath={filePath}
                    setFilePath={setFilePath}
                    fileType={fileType}
                    setTargetData={setTargetData}
                  />
                )
              ) : (
                "Please select a file [currently supports OBS and translation Notes only]"
              )}
            </div>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
