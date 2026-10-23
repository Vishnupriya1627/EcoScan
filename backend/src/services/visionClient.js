const FormData = require("form-data");
const axios = require("axios");

async function analyzeImage(buffer, mimetype) {
  const form = new FormData();

  form.append("file", buffer, {
    filename: "clothing-image",
    contentType: mimetype
  });

  const response = await axios.post(
    "http://127.0.0.1:8000/analyze",
    form,
    {
      headers: form.getHeaders(),
      timeout: 600000,
      maxBodyLength: Infinity,
      maxContentLength: Infinity
    }
  );

  return response.data;
}

module.exports = { analyzeImage };
