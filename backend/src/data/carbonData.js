// kg CO2e to make ONE new item. ILLUSTRATIVE PLACEHOLDERS: tune and cite in README.
const carbonData = {
  tshirt:   { name: "T-Shirt",  carbon: 5,  action: ["Resell or swap", "Good-condition tees resell and swap easily."] },
  shirt:    { name: "Shirt",    carbon: 7,  action: ["Resell or swap", "Good-condition shirts resell easily."] },
  jeans:    { name: "Jeans",    carbon: 10, action: ["Repair", "Patching or re-hemming jeans is one of the easiest life extensions."] },
  trousers: { name: "Trousers", carbon: 9,  action: ["Repair", "Hems and seams are cheap to fix."] },
  dress:    { name: "Dress",    carbon: 12, action: ["Resell or swap", "Dresses hold resale value well and are often worn only a few times."] },
  jacket:   { name: "Jacket",   carbon: 15, action: ["Repair", "Zips, linings and seams are cheap to fix and extend life a lot."] },
  sweater:  { name: "Sweater",  carbon: 11, action: ["Keep wearing", "The lowest-carbon garment is the one you already own."] },
  shorts:   { name: "Shorts",   carbon: 6,  action: ["Keep wearing", "The lowest-carbon garment is the one you already own."] },
  skirt:    { name: "Skirt",    carbon: 7,  action: ["Resell or swap", "List it on a resale app or swap with friends."] },
  shoes:    { name: "Shoes",    carbon: 14, action: ["Repair", "A cobbler can resole or restitch shoes and add years of wear."] },
  hoodie:   { name: "Hoodie",   carbon: 14, action: ["Repair", "Mend cuffs and seams before replacing."] },
  other:    { name: "Other",    carbon: 8,  action: ["Keep wearing", "The lowest-carbon garment is the one you already own."] },
};

module.exports = carbonData;