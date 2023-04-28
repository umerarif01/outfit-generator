const url = "https://api.openai.com/v1/completions";

export const generateContentByGPT = async (prompt) => {
  const data = JSON.stringify({
    model: "text-davinci-003",
    prompt: prompt,
    max_tokens: 1000,
    temperature: 0.5,
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

async function generateDalleImages(prompt) {
  const response = await fetch("/api/dallE", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
    }),
  });
  const data = await response.json();
  const img = data.data;
  return img;
}

async function generateHuggingFace(prompt) {
  // Joeythemonster/anything-midjourney-v-4-1
  const URL = `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1`;

  const response = await fetch(URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt,
      options: {
        use_cache: false,
        wait_for_model: true,
      },
    }),
  });

  const type = response.headers.get("content-type");
  const data = await response.arrayBuffer();

  const base64data = Buffer.from(data).toString("base64");
  const img = `data:${type};base64,` + base64data;
  return img;
}

export { generateDalleImages, generateHuggingFace };
