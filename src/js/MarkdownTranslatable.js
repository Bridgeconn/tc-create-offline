import React, { useEffect } from "react";
import { Translatable } from "markdown-translatable";
var fs = require("fs");
const path = require("path");
const os = require("os");
const homeDir = os.homedir();

const MarkdownTranslatable = ({
  sourceData,
  targetData,
  resource,
  filePath,
  fileName,
  fileType,
  setTargetData,
  setFilePath,
}) => {
  const [markdown, setMarkdown] = React.useState(sourceData);
  const [translation, setTranslation] = React.useState(targetData);

  const [mode, setMode] = React.useState(true);

  // React.useEffect(() => {
  //   if (mode) setTranslation(translation);
  //   else setTranslation(markdown);
  // }, [mode, translation, markdown]);
  // useEffect(()=>{
  //   // console.log(filePath,"fp")
  //   console.log(path.join(homeDir,'tc-create','Output','obs',filePath?.split("en_obs-v9/en_obs")[1]));
  // },[])

  const onTranslation = (_translation) => {
    console.log("on save", resource);
    let filepath1;
    console.log(filePath);
    //D:\git\tc-create-offline\src\assets\Resources\en_obs-v9\en_obs\content\01.md
    console.log(filePath.split("en_obs-v9"));
    if (resource === "en_obs") {
      filepath1 = filePath.includes("Resources")
        ? path.join(
            homeDir,
            "tc-create",
            "Output",
            "obs",
            filePath.split("en_obs-v9")[1]
          )
        : filePath;
    } else if (resource === "en_tw") {
      filepath1 = filePath.includes("Resources")
        ? path.join(
            homeDir,
            "tc-create",
            "Output",
            "tw",
            filePath.split("en_tw-release_v77/en_tw")[1]
          )
        : filePath;
    } else if (resource === "en_ta") {
      filepath1 = filePath.includes("Resources")
        ? path.join(
            homeDir,
            "tc-create",
            "Output",
            "ta",
            filePath.split("en_ta-release_v77/en_ta")[1]
          )
        : filePath;
    } else if (resource === "en_tn") {
      filepath1 = filePath.includes("Resources")
        ? path.join(
            homeDir,
            "tc-create",
            "Output",
            "tn",
            filePath.split("en_tn-release_v77/en_tn")[1]
          )
        : filePath;
    }

    const directoryPath = path.dirname(filepath1);

    // Check if the directory exists
    if (!fs.existsSync(directoryPath)) {
      // If it doesn't exist, create the directory
      fs.mkdirSync(directoryPath, { recursive: true });
    }
    // ------------need to be checked----------------->
    fs.writeFile(filepath1, _translation, function (err) {
      if (err) {
        alert("An error ocurred updating the file" + err.message);
        console.log(err);
        return;
      }
      setTranslation(_translation);
      alert("The file has been successfully saved");
      console.log("The file has been successfully saved");
      setFilePath(filepath1);
      setTargetData(_translation);
    });
  };

  return (
    <>
      <Translatable
        original={markdown}
        translation={translation}
        onTranslation={onTranslation}
        inputFilters={[
          [/<br>/gi, "\n"],
          [/(<u>|<\/u>)/gi, "__"],
        ]}
        outputFilters={[]}
        sectionable={true}
        doPinToolbar={false}
      />
    </>
  );
};

export default MarkdownTranslatable;
