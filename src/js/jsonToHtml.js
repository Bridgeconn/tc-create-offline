import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";


// import PropTypes from "prop-types";

const MdToJson = (data) => {
    //convert md file text into json object
    //render story from json array object
    let story = [];
    let id = 0;
    const allLines = data.split(/\r\n|\n/);
    let title = "";
    let end = "";
    let error = "";
    // Reading line by line
    try {
        allLines.forEach((line) => {
            if (line) {
                if (line.match(/^#/gm)) {
                    const hash = line.match(/# (.*)/);
                    title = hash[1];
                } else if (line.match(/^_/gm)) {
                    const underscore = line.match(/_(.*)_/);
                    end = underscore[1];
                } else if (line.match(/^!/gm)) {
                    id += 1;
                    const imgUrl = line.match(/\((.*)\)/);
                    story.push({
                        id,
                        url: imgUrl[1],
                        text: ""
                    });
                } else {
                    story[id - 1].text = line;
                }
            }
        });
    } catch (e) {
        error = "Error parsing OBS md file text";
        title = "";
        end = "";
        story = [];
    }

    return { title, story, end, error };
};



const getStory = (obsStory) => {
    return obsStory?.story.map((story) => (
        <div
            className="flex m-4 p-4 border-solid border-2 border-gray-200 rounded-md h-40"
            key={story.url}
        >
            <img
                src={story.url}
                alt="OBS Image"
                className="flex h-auto rounded-lg border-2"
            />
            <div className="flex-grow text-justify ml-2 p-2 text-sm">
                {story.text}
            </div>
        </div>
    ));
};
const getTitle = (obsStory) => {
    return (
        obsStory?.title && (
            <div className="text-2xl border-2 bg-gray-300 border-solid p-2 font-serif">
                <h1>{obsStory.title}</h1>
            </div>
        )
    );
};

const getEnd = (obsStory) => {
    return (
        obsStory?.end && (
            <div className="text-xl bg-gray-300 border-2 p-2 font-serif">
                <h1>{obsStory.end}</h1>
            </div>
        )
    );
};
const Reference = ({ data }) => {
    const [obsStory, setObsStory] = useState(null);

    useEffect(() => {
        setObsStory(MdToJson(data ?? ""));
    }, [data]);

    return (
        <div className="container">
            {getTitle(obsStory)}
            {getStory(obsStory)}
            {getEnd(obsStory)}
            {obsStory?.error && (
                <div className="text-xl bg-red-500 border-2 p-2 font-serif">
                    <h1 className="text-white">{obsStory.error}</h1>
                </div>
            )}
        </div>
    );
};
Reference.propTypes = {
    data: PropTypes.string,
};
export default Reference;