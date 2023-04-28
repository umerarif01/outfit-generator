import ChatMessage from "components/ChatMessage";
import Head from "next/head";
import Image from "next/image";
import { useState, useRef } from "react";
import { generateContentByGPT } from "utils/api";
// import { generateImage } from "utils/api";

export default function Home() {
  const currentModel = "text-davinci-003";
  const [advices, setAdvices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState(false);
  const menuToggle = useRef(null);
  const sidemenu = useRef(null);
  const [formValues, setFormValues] = useState({
    numberOfAdvice: "1",
    gender: "Male",
    weather: "Sunny",
    dressStyle: "Classic",
    outfitColors: "",
    age: "25",
  });

  function clearAdvices() {
    setAdvices([]);
    setMode(false);
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  function separateSentences(text) {
    if (!text) return;
    console.log(formValues);
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

  const prompt = `Recommend ${formValues.numberOfAdvice} outfit advices for a ${formValues.age} years old ${formValues.gender} to wear. An outfit always consists of a combination of a top, bottom, and shoes, but it should not be limited to these items alone. You can add other items to the outfit as well. The weather is ${formValues.weather}, The dress should be ${formValues.dressStyle} and the color should be ${formValues.outfitColors}. The response should always be in numbered form.`;

  async function generateContent(e) {
    e.preventDefault();
    setMode(false);
    setLoading(true);

    try {
      const data = await generateContentByGPT(prompt);
      let response = data.choices[0].text;
      const newAdvice = separateSentences(response);
      console.log(newAdvice);
      setAdvices(newAdvice);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("Error occured. Please try again later.");
    }
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
        <header>
          <div className="navbar">
            <div className="logo">
              <h2>Logo Here</h2>
            </div>
            <div className="nav-links">
              <ul>
                <li></li>
              </ul>
            </div>
          </div>
        </header>

        <main>
          <section className="showcase">
            <form onSubmit={generateContent}>
              <h1>Outfit Generator</h1>
              <p className="subtitle">Please select the options below:</p>
              <div className="form-control"></div>
              <div className="grid-container">
                <div className="input">
                  <label>Number of Advice:</label>
                  <input
                    type="number"
                    name="numberOfAdvice"
                    className="input-field"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="input">
                  <label>Gender:</label>
                  <select
                    name="gender"
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Gender"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="input">
                  <label>Weather:</label>
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
                </div>
                <div className="input">
                  <label>Dress Style:</label>
                  <select
                    name="dressStyle"
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="Classic">Classic</option>
                    <option value="Casual">Casual</option>
                    <option value="Dramatic">Dramatic</option>
                    <option value="Creative">Creative</option>
                    <option value="Relaxed">Relaxed</option>
                    <option value="Rebellious">Rebellious</option>
                    <option value="Elegant">Elegant</option>
                  </select>
                </div>
                <div className="input">
                  <label>Color of the outfit:</label>
                  <input
                    type="text"
                    name="outfitColors"
                    className="input-field"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="input">
                  <label>Age:</label>
                  <input
                    type="number"
                    name="age"
                    className="input-field"
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <button type="submit" className="btn">
                Generate
              </button>
            </form>
          </section>

          <section className="content">
            <ChatMessage
              user="gpt"
              message=""
              advices={advices}
              loading={loading}
              values={formValues}
              mode={mode}
              setMode={setMode}
            />
          </section>
        </main>
      </main>
    </>
  );
}
