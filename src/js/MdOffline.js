import React from 'react';

const MdOffline = ({ sourceData, targetData, fileName, resource, filePath, fileType }) => {

    // Function to extract image links from the content
    const extractImageLinks = (content) => {
        const imageLinkRegex = /!\[(.*?)\]\((.*?)\)/g; // Markdown image syntax
        const imageLinks = [];
        let match;
        while ((match = imageLinkRegex.exec(content)) !== null) {
            const [, altText, filename] = match;
            imageLinks.push({ altText, filename });
        }
        return imageLinks;
    };

    // // Function to render images based on image links
    // const renderImages = (imageLinks) => {
    //     return imageLinks.map((link, index) => (
    //         <div key={index}>
    //             <p>{link.altText}</p>
    //             <img src={link.filename} alt={link.altText} />
    //         </div>
    //     ));
    // };

    // Function to split content into text and image sections
    const splitContent = (content) => {
        const parts = content.split(/!\[.*?\]\(.*?\)/g); // Split by image links
        const images = extractImageLinks(content);
        const combined = [];
        for (let i = 0; i < parts.length; i++) {
            combined.push(parts[i]);
            if (images[i]) {
                combined.push(images[i]);
            }
        }
        return combined;
    };

    // Extract image links from the content
    const imageLinks = extractImageLinks(targetData);
    // Split content into text and image sections
    const contentSections = splitContent(targetData);

    return (
        <div>
            <h2>Content with Images</h2>
            {contentSections.map((section, index) => (
                typeof section === 'string' ? (
                    // Display text content
                    <p key={index}>{section}</p>
                ) : (
                    // Display image
                    <div key={index}>
                        <p>{section.altText}</p>
                        <img src={section.filename} alt={section.altText} />
                    </div>
                )
            ))}
        </div>
    );
};

export default MdOffline;
