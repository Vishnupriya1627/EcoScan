function analyzeImage(file) {
  if (!file) {
    throw new Error("An image is required.");
  }

  // Mock recognition for the assignment.
  // Replace this function with a real vision model later.
  return [
    { type: "tshirt", quantity: 1 },
    { type: "jeans", quantity: 1 },
  ];
}

module.exports = { analyzeImage };