import Image from "next/image";
import React, { useState } from "react";
import { generateDalleImages, generateHuggingFace } from "utils/api";
import Spinner from "./Spinner";

const ChatMessage = ({
  user,
  message,
  advices,
  loading,
  values,
  mode,
  setMode,
}) => {
  const [images, setImages] = useState([]);
  const [generating, setGenerating] = useState(false);

  const startPhrase = `A real image of a ${values.age} years old ${values.gender} wearing a outfit which comprises of `;

  const endPhrase =
    "This image shows entire body with shoes except face. The colors of the outfit should match exactly with the prompt.";

  function addPhrases(sentences, startPhrase, endPhrase) {
    const modifiedSentences = sentences.map((sentence) => {
      return startPhrase + sentence.trim() + endPhrase;
    });
    return modifiedSentences;
  }

  async function generateDalleImagesForPrompts(prompts) {
    let modifiedPrompts = addPhrases(prompts, startPhrase, endPhrase);
    console.log(modifiedPrompts);
    setMode(true);
    setGenerating(true);
    setImages([]);
    const images = [];
    for (let prompt of modifiedPrompts) {
      const url = await generateDalleImages(prompt);
      images.push(url);
    }
    const data = [];
    for (let prompt = 0; prompt < prompts.length; prompt++) {
      let url = images[prompt];
      let advice = prompts[prompt];
      data.push({ url, advice });
    }
    setGenerating(false);
    console.log(data);
    setImages(data);
  }

  return (
    <div>
      {loading ? (
        <div className="spinner">
          <Spinner />
          <h4>Generating...</h4>
        </div>
      ) : (
        <>
          {" "}
          <div className="">
            <div className="message">
              {advices.length === 0 ? (
                message
              ) : (
                <>
                  <h4>
                    Please find below a list of outfit recommendations that have
                    been generated based on the selected options:
                  </h4>
                  {advices.map((advice, index) => (
                    <div className="advices" key={index}>
                      <p className="">
                        {index + 1}. ) {advice}
                      </p>
                    </div>
                  ))}
                </>
              )}
              {!mode ? (
                advices.length > 0 && (
                  <div className="center">
                    {" "}
                    <button
                      className="input-button"
                      onClick={() => generateDalleImagesForPrompts(advices)}
                    >
                      Generate images for the following recommendations
                    </button>
                  </div>
                )
              ) : (
                <>
                  <>
                    {generating ? (
                      <div className="spinner">
                        <Spinner />
                        <h3>Generating...</h3>
                      </div>
                    ) : (
                      <div>
                        {images.map((image, index) => (
                          <div key={index}>
                            <p className="imgname">{image.advice}</p>
                            <img
                              src={image.url}
                              alt={image.name}
                              width={640}
                              height={640}
                              className="ai-image"
                            />
                          </div>
                        ))}
                        <div className="center">
                          <button
                            className="input-button"
                            onClick={() =>
                              generateDalleImagesForPrompts(advices)
                            }
                          >
                            Generate these images again
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatMessage;
