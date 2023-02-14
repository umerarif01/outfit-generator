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

export { generateDalleImages };
