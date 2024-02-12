import React,{useEffect} from 'react'
import { Translatable } from "markdown-translatable";
import PrintPreview from "./PrintPreview";
var fs = require('fs');

const MarkdownTranslatable = ({sourceData,targetData,resource,filePath}) => {
const [markdown,setMarkdown]=  React.useState(sourceData)
const [translation, setTranslation] = React.useState(targetData);

const [mode, setMode] = React.useState(true);
// const toggleMode = () => { setMode(!mode); };

React.useEffect(() => {
  if (mode) setTranslation(translation);
  else setTranslation(markdown);
},[mode, translation, markdown]);

// useEffect(()=>{
//     setMarkdown(sourceData)
//     setTranslation(targetData)
//     // setRes(resource) 
//     },[sourceData])

useEffect(() => {
    setMarkdown(sourceData);
//    setTranslation(targetData);
    // console.log(targetData,"target")
    
    // console.log(sourceData,"source")
  }, [sourceData,filePath]);

  useEffect(() => {
    setTranslation(targetData);
    // console.log(targetData,"target")
  }, [targetData]);


const onTranslation = (_translation) => {
    

     if(resource==='en_obs'){

        let filepath1=filePath.includes("Resources/")?filePath.replace(`Resources/${resource}-v9`,"Output"):filePath
    
        fs.writeFile(filepath1, _translation, function (err) {
          if(err){
              alert("An error ocurred updating the file"+ err.message);
              console.log(err);
              return;
          }
          setTranslation(_translation);

          alert("The file has been successfully saved");
          //preventDefault()
    
      }); 
    }
   
  };


    return ( 
<>
  <Translatable
    original={markdown}
    translation={translation}
    onTranslation={onTranslation}
    inputFilters={[[/<br>/gi, "\n"],[/(<u>|<\/u>)/gi, '__']]}
    outputFilters={[]}
    sectionable={true}
    doPinToolbar={false}
  />
</>
     );
}
 
export default MarkdownTranslatable;