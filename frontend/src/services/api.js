const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function scanClothing(file) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_URL}/scan`, {
    method: "POST",
    body: formData
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Unable to scan image");
  }

  return data;
}

export async function getOffers(points) {
  const response = await fetch(`${API_URL}/offers?points=${points}`);
  return response.json();
}