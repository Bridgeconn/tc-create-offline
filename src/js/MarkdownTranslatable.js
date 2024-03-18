import React, { useEffect } from 'react'
import { Translatable } from "markdown-translatable";
import PrintPreview from "./PrintPreview";
var fs = require('fs');

const MarkdownTranslatable = ({ sourceData, targetData, resource, filePath, fileName, fileType, onSaveEdited }) => {
  const [markdown, setMarkdown] = React.useState(sourceData)
  const [translation, setTranslation] = React.useState(targetData);

  const [mode, setMode] = React.useState(true);

  // React.useEffect(() => {
  //   if (mode) setTranslation(translation);
  //   else setTranslation(markdown);
  // }, [mode, translation, markdown]);

  // useEffect(()=>{
  //     setMarkdown(sourceData)
  //     setTranslation(targetData)
  //     // setRes(resource) 
  //     },[sourceData])

  // useEffect(() => {
  //   setMarkdown(sourceData);
  //   //    setTranslation(targetData);
  //   // console.log(targetData,"target")

  //   // console.log(sourceData,"source")
  // }, [sourceData, filePath]);

  // useEffect(() => {
  //   setTranslation(targetData);
  //   // console.log(targetData,"target")
  // }, [targetData]);


  useEffect(() => {
    onSaveEdited(translation)
  }, [translation])

  const onTranslation = (_translation) => {


    if (resource === 'en_obs') {
      setTranslation(_translation)
      alert('click the save button to save the content in the file')

      // let filepath1 = filePath.includes("Resources/") ? filePath.replace(`Resources/${resource}-v9`, "Output") : filePath
      // ------------need to be checked----------------->
      // fs.writeFile(filepath1, _translation, function (err) {
      //   if (err) {
      //     alert("An error ocurred updating the file" + err.message);
      //     console.log(err);
      //     return;
      //   }
      //   setTranslation(_translation);
      //   console.log("The file has been successfully saved");
      // });
    }

  };


  return (
    <>
      {/* {
        <PrintPreview filePath={filePath} fileName={fileName} fileType={fileType} translationContent={translation} />
      }
      <br /> */}

      <Translatable
        original={markdown}
        translation={translation}
        onTranslation={onTranslation}
        inputFilters={[[/<br>/gi, "\n"], [/(<u>|<\/u>)/gi, '__']]}
        outputFilters={[]}
        sectionable={true}
        doPinToolbar={false}
      />
    </>
  );
}

export default MarkdownTranslatable;