function analyzeImage(file) {
  if (!file) {
    throw new Error("An image is required.");
  }

  return [
    { type: "tshirt", quantity: 1 },
    { type: "jeans", quantity: 1 },
  ];
}

module.exports = { analyzeImage };