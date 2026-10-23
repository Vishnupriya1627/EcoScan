const carbonData = require("../data/carbonData");

function calculateEcoScore(recognizedItems) {
  const items = recognizedItems.map((recognized) => {
    const clothing = carbonData[recognized.type];

    if (!clothing) {
      throw new Error(`Unknown clothing type: ${recognized.type}`);
    }

    const quantity = recognized.quantity ?? 1;

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      throw new Error("Quantity must be an integer between 1 and 20.");
    }

    return {
      name: clothing.name,
      quantity,
      carbon: clothing.carbon * quantity,
    };
  });

  const totalCarbon = Number(
    items.reduce((total, item) => total + item.carbon, 0).toFixed(2)
  );

  const points = Math.round(totalCarbon * 2);

  return {
    items,
    totalCarbon,
    points,
  };
}

module.exports = { calculateEcoScore };