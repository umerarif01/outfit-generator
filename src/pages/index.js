import ChatMessage from "components/ChatMessage";
import Head from "next/head";
import Image from "next/image";
import { useState, useRef } from "react";
// import { generateImage } from "utils/api";

export default function Home() {
  const currentModel = "text-davinci-003";
  const [advices, setAdvices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState(false);
  const menuToggle = useRef(null);
  const sidemenu = useRef(null);
  const [formValues, setFormValues] = useState({
    numberOfAdvice: "",
    gender: "",
    weather: "",
    dressStyle: "",
    outfitColors: "",
  });

  function clearAdvices() {
    setAdvices([]);
    setMode(false);
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  function handleClick() {
    menuToggle.current.classList.toggle("is-active");
    sidemenu.current.classList.toggle("is-active");
  }

  function separateSentences(text) {
    if (!text) return;
    const sentences = text
      .split(/\d+\.\s*/)
      .filter((sentence) => sentence.trim() !== "")
      .map((sentence) => sentence.trim())
      .map((sentence) => {
        const match = sentence.match(/^\d+\.\s*/);
        if (match) {
          return sentence.substring(match[0].length) + match[0];
        }
        return sentence;
      });
    return sentences;
  }

  const prompt = `Recommend me ${formValues.numberOfAdvice} outfit advices to wear.The complete outfit should comprise of a top, a bottom, and a pair of shoes. I am a ${formValues.gender},the weather is ${formValues.weather}, The dress should be ${formValues.dressStyle} and the color should be ${formValues.outfitColors}. If it is male, then all outfits should be for male. If it is female, then all outfits should be for female.The response should be always like this: "A white T-shirt, blue ripped jeans, and white sneakers". The response should always be in numbered form.  No extra information required.`;

  async function generateContent(e) {
    e.preventDefault();

    setLoading(true);
    const response = await fetch("api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: prompt,
        currentModel,
      }),
    });
    const data = await response.json();
    setLoading(false);
    const newAdvice = separateSentences(data.message);
    console.log(newAdvice);
    setAdvices(newAdvice);
  }

  return (
    <>
      <Head>
        <title>AI Outfits Generator</title>
        <meta
          name="description"
          content="Generate outfit recommendations with AI"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="App">
        <aside className="sidemenu" ref={sidemenu}>
          <div className="menu">
            <div className="sidemenu-button" onClick={clearAdvices}>
              <span>+</span>
              Clear Advice
            </div>

            <form
              onSubmit={(e) => {
                generateContent(e);
              }}
            >
              <p>
                Number of advice:
                <input
                  type="number"
                  name="numberOfAdvice"
                  className="input-field"
                  onChange={handleInputChange}
                />
              </p>
              <p>
                Gender:
                <select
                  name="gender"
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </p>
              <p>
                Weather:
                <select
                  name="weather"
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="Sunny">Sunny</option>
                  <option value="Rainy">Rainy</option>
                  <option value="Cloudy">Cloudy</option>
                  <option value="Snowy">Snowy</option>
                </select>
              </p>
              <p>
                Dress style:
                <select
                  name="dressStyle"
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="Classic">Classic</option>
                  <option value="Relaxed">Relaxed</option>
                  <option value="Dramatic">Dramatic</option>
                  <option value="Creative">Creative</option>
                </select>
              </p>
              <p>
                Colors of the outfit:
                <input
                  type="text"
                  name="outfitColors"
                  className="input-field"
                  onChange={handleInputChange}
                />
              </p>
              <button type="submit">
                {loading ? "Generating Advice" : "Generate Advice"}
              </button>
            </form>
          </div>
        </aside>
        <section className="chatbox">
          <div ref={menuToggle} className="menu-toggle" onClick={handleClick}>
            <div className="hamburger">
              <span></span>
            </div>
          </div>

          <ChatMessage
            user="gpt"
            message="Welcome! Let's get you dressed for the day. I will recommend you some amazing outfits"
            advices={advices}
            loading={loading}
            gender={formValues.gender}
            mode={mode}
            setMode={setMode}
          />

          <div className="margin-above" />
        </section>
      </main>
    </>
  );
}
