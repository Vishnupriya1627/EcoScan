const carbonValues = {
  tshirt: 5,
  shirt: 7,
  jeans: 10,
  trousers: 9,
  dress: 12,
  jacket: 15,
  sweater: 12,
  shorts: 6,
  skirt: 7,
  shoes: 14,
  hoodie: 11,
  other: 8
};

function calculateCarbon(items) {
  const results = items.map((item) => {
    const type = carbonValues[item.type] ? item.type : "other";
    const quantity = Math.max(1, Math.min(20, Number(item.quantity) || 1));
    const carbon = carbonValues[type] * quantity;

    return {
      ...item,
      type,
      quantity,
      carbon
    };
  });

  const totalCarbon = results.reduce((sum, item) => sum + item.carbon, 0);

  return {
    items: results,
    totalCarbon: Number(totalCarbon.toFixed(1))
  };
}

module.exports = { calculateCarbon };