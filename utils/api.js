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
