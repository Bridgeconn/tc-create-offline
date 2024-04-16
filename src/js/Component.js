import React, { useEffect, useRef } from "react";
import { Typography } from "@material-ui/core";
import { DataTable } from "datatable-translatable";
import * as parser from "uw-tsv-parser";
var fs = require("fs");
const path = require('path');
const os = require('os');
const homeDir = os.homedir();
export default function Component({
  sourceData,
  targetData,
  fileName,
  resource,
  filePath,
  fileType,
  setFilePath,
  setTargetData
}) {
  const [sourceFile, setSourceFile] = React.useState(sourceData);
  const [savedFile, setSavedFile] = React.useState(targetData);
  const [res, setRes] = React.useState(resource);

  // useEffect(() => {
  //   if(filePath!==undefined){
  //   setSourceFile(sourceData);
  //   setSavedFile(targetData);
  //   setRes(resource);
  //   console.log(resource,filePath,"src")
  // }
  // }, [resource, sourceData, filePath]);

  // useEffect(() => {
  //   setSourceFile(sourceData);
  //   setSavedFile(targetData);
  // }, [sourceData, fileName]);

  //Uncomment this to test a page change from a new source file
  // setTimeout(() => {
  //   setSourceFile(targetFile);
  // }, 5000)

  const delimiters = { row: "\n", cell: "\t" };

  const options = {
    page: 0,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 25, 50, 100],
  };

  const rowHeader = (rowData, actionsMenu) => {
    const reference = rowData[0].split(delimiters.cell)[0];
    const bookId = fileName;
    const styles = {
      typography: {
        lineHeight: "1.0",
        fontWeight: "bold",
      },
    };
    const component = (
      <>
        <Typography variant="h6" style={styles.typography}>
          {`${bookId} ${reference}`}
        </Typography>
        {actionsMenu}
      </>
    );
    return component;
  };
  // Column headers for 7 column format:
  // Reference, ID, Tags, SupportReference, Quote, Occurrence, and Annotation.
  console.log(res,"resource")
  const config =
    // (res==="en_twl" || res==="en_obs_sn")
    //   ? {
    //       compositeKeyIndices: [0, 1],
    //       columnsFilter: ["Reference", "ID", "Tags"],
    //       columnsShowDefault: [
    //         "SupportReference",
    //         "Quote",
    //         "Occurrence",
    //         // "Note",
    //       ],
    //       rowHeader,
    //     }
      // : 
      {
          compositeKeyIndices: [0, 1],
          columnsFilter: ["Reference", "ID", "Tags"],
          columnsShowDefault: [
            // "SupportReference",
            "Quote",
            "Occurrence",
            // "Annotation",
            // "Question",
            // "Answer",
          ],
          rowHeader,
        };

  const onSave = (_savedFile) => {
    let filepath;
    if (resource === "en_tq") {
      filepath = filePath.includes("Resources/")
        ? path.join(
            homeDir,
            "tc-create",
            "Output",
            "tq",
            filePath.split("en_tq-release_v77/en_ta")[1]
          )
        : filePath;
    } else if (resource === "en_tn") {
      filepath = filePath.includes("Resources/")
        ? path.join(
            homeDir,
            "tc-create",
            "Output",
            "tn",
            filePath.split("en_tn-release_v77/en_tn")[1]
          )
        : filePath;
    } else if (resource === "en_obs_sn") {
      filepath = filePath.includes("Resources/")
        ? path.join(
            homeDir,
            "tc-create",
            "Output",
            "obs-sn",
            filePath.split("en_obs-sn_v5/en_ons-sn")[1]
          )
        : filePath;
    } else if (resource === "en_obs_sq") {
      filepath = filePath.includes("Resources/")
        ? path.join(
            homeDir,
            "tc-create",
            "Output",
            "obs-sq",
            filePath.split("en_obs-sq-v4/en_obs-sq")[1]
          )
        : filePath;
    } else if (resource === "en_obs_tn") {
      filepath = filePath.includes("Resources/")
        ? path.join(
            homeDir,
            "tc-create",
            "Output",
            "obs-tn",
            filePath.split("en_obs-tn-release_v12/en_obs-tn")[1]
          )
        : filePath;
    } else if (resource === "en_obs_tq") {
      filepath = filePath.includes("Resources/")
        ? path.join(
            homeDir,
            "tc-create",
            "Output",
            "obs-tq",
            filePath.split("en_obs-tq-v9/en_obs-tq")[1]
          )
        : filePath;
    } else if (resource === "en_twl") {
      filepath = filePath.includes("Resources/")
        ? path.join(
            homeDir,
            "tc-create",
            "Output",
            "twl",
            filePath.split("en_twl-release_v77/en_twl")[1]
          )
        : filePath;
    }

    const directoryPath = path.dirname(filepath);

    // Check if the directory exists
    if (!fs.existsSync(directoryPath)) {
      // If it doesn't exist, create the directory
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    fs.writeFile(filepath, _savedFile, function (err) {
      if (err) {
        alert("An error ocurred updating the file" + err.message);
        console.log(err);
        return;
      }
      setSavedFile(_savedFile);
      console.log("The file has been successfully saved");

    });
    alert("The file has been successfully saved");
    setFilePath(filepath);
    setTargetData(_savedFile);
  };

  const onValidate = () => {
    console.log("Validate!");
  };
  const generateRowId = (rowData) => {
    const reference = rowData[1].split(delimiters.cell)[0];
    const [chapter, verse] = reference.split(":");
    const [uid] = rowData[2].split(delimiters.cell)[1];
    let rowId = `header-${chapter}-${verse}-${uid}`;
    return rowId;
  };

  return (
    <>
      <DataTable
        sourceFile={sourceFile}
        targetFile={savedFile}
        onSave={onSave}
        onValidate={onValidate}
        parser={parser}
        delimiters={delimiters}
        config={config}
        options={options}
        generateRowId={generateRowId}
      />
    </>
  );
}
