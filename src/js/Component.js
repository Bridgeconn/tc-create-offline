import React, { useEffect, useRef } from "react";
import { Typography } from "@material-ui/core";
import { DataTable } from "datatable-translatable";
import * as parser from 'uw-tsv-parser';
var fs = require('fs');



export default function Component({ sourceData, targetData, fileName, resource, filePath, fileType }) {
  const [sourceFile, setSourceFile] = React.useState("");
  const [savedFile, setSavedFile] = React.useState('');
  const [res, setRes] = React.useState("");


  useEffect(() => {
    setSourceFile(sourceData)
    setSavedFile(targetData)
    setRes(resource)
  }, [resource, sourceData, filePath])



  useEffect(() => {
    setSourceFile(sourceData)
    setSavedFile(targetData)
  }, [sourceData, fileName])

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

  const config = (res === "en_tn" ? {
    compositeKeyIndices: [0, 1],
    columnsFilter: ["Reference", "ID", "Tags"],
    columnsShowDefault: [
      "SupportReference",
      "Quote",
      "Occurrence",
      // "Note",
    ],
    rowHeader,
  } : {
    compositeKeyIndices: [0, 1],
    columnsFilter: ["Reference", "ID", "Tags"],
    columnsShowDefault: [
      // "SupportReference",
      "Quote",
      "Occurrence",
      // "Annotation",
      "Question",
      "Answer",
    ],
    rowHeader,
  });


  const onSave = (_savedFile) => {
    if (resource === 'en_tq') {
      let filepath = filePath.includes("Resources/") ? filePath.replace(`Resources/${resource}-release_v77`, "Output") : filePath

      fs.writeFile(filepath, _savedFile, function (err) {
        if (err) {
          alert("An error ocurred updating the file" + err.message);
          console.log(err);
          return;
        }
        alert("The file has been successfully saved");
        setSavedFile(_savedFile);
      });
    }
    else if (resource === 'en_tn') {

      let filepath = filePath.includes("Resources/") ? filePath.replace(`Resources/${resource}-release_v77`, "Output") : filePath
      fs.writeFile(filepath, _savedFile, function (err) {
        if (err) {
          alert("An error ocurred updating the file" + err.message);
          console.log(err);
          return;
        }
        alert("The file has been successfully saved");
        setSavedFile(_savedFile);
      });

    }
  };

  const onValidate = () => {
    alert("Validate!");
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