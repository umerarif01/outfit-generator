async function generateContentByGPT(prompt) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `${prompt}` }],
      }),
    });

    const data = await response.json();
    const completion = data.choices[0].message;
    return completion;
  } catch (error) {
    console.error("Error:", error);
  }
}

const url = "https://api.openai.com/v1/images/generations";

const generateDalleImages = async (prompt) => {
  const data = JSON.stringify({
    prompt: prompt,
    n: 1,
    size: "1024x1024",
  });

  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
  });

  return fetch(url, {
    method: "POST",
    body: data,
    headers: headers,
  })
    .then((response) => response.json())
    .catch((error) => console.error(error));
};

export { generateDalleImages, generateContentByGPT };
