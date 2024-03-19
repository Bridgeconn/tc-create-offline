import React, { useEffect } from 'react'
import { Translatable } from "markdown-translatable";
var fs = require('fs');

const MarkdownTranslatable = ({ sourceData, targetData, resource, filePath, fileName, fileType }) => {
  const [markdown, setMarkdown] = React.useState(sourceData)
  const [translation, setTranslation] = React.useState(targetData);

  const [mode, setMode] = React.useState(true);

  // React.useEffect(() => {
  //   if (mode) setTranslation(translation);
  //   else setTranslation(markdown);
  // }, [mode, translation, markdown]);

  const onTranslation = (_translation) => {
    if (resource === 'en_obs') {
      let filepath1 = filePath.includes("Resources/") ? filePath.replace(`Resources/${resource}-v9`, "Output") : filePath
      // ------------need to be checked----------------->
      fs.writeFile(filepath1, _translation, function (err) {
        if (err) {
          alert("An error ocurred updating the file" + err.message);
          console.log(err);
          return;
        }
        setTranslation(_translation);
        console.log("The file has been successfully saved");
      });
    }

  };


  return (
    <>
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