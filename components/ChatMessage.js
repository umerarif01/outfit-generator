import Image from "next/image";
import React, { useState } from "react";
import { generateDalleImages } from "utils/api";
import Loader from "./Loader";
import Spinner from "./Spinner";

const ChatMessage = ({
  user,
  message,
  advices,
  loading,
  gender,
  mode,
  setMode,
}) => {
  const [images, setImages] = useState([]);
  const [generating, setGenerating] = useState(false);

  const startPhrase = `A ${gender} wearing`;
  const endPhrase = "Show the entire body except face.";

  function addPhrases(sentences, startPhrase, endPhrase) {
    const modifiedSentences = sentences.map((sentence) => {
      return startPhrase + sentence.trim() + endPhrase;
    });
    return modifiedSentences;
  }

  async function generateDalleImagesForPrompts(prompts) {
    let modifiedPrompts = addPhrases(prompts, startPhrase, endPhrase);
    setMode(true);
    setGenerating(true);
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
        <Loader />
      ) : (
        <>
          {" "}
          <div className={`chat-message ${user === "gpt" && "chatgpt"}`}>
            <div className="chat-message-center">
              <Image
                src={`${user === "gpt" ? "/aicon.jpg" : "/user.png"}`}
                width={40}
                height={40}
                alt={`${user === "gpt" ? "gpt" : "user"}`}
                className={`avatar ${user === "gpt" && "chatgpt"}`}
              />
              <div className="message">
                {advices.length === 0 ? (
                  message
                ) : (
                  <>
                    <h4>
                      Please find below a list of outfit recommendations that
                      have been generated based on the selected options:
                    </h4>
                    {advices.map((advice, index) => (
                      <p key={index} className="">
                        {index + 1}.) {advice}
                      </p>
                    ))}
                  </>
                )}
                {!mode ? (
                  advices.length > 0 && (
                    <div>
                      {" "}
                      <h4>
                        Do you wish to generate images for the following
                        recommendations?
                      </h4>
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
                    {generating ? (
                      <div className="spinner">
                        <Spinner />
                        <h4>Generating...</h4>
                      </div>
                    ) : (
                      images.map((image, index) => (
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
                      ))
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatMessage;
