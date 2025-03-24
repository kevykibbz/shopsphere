const ensureArray = (input) => {
  if (Array.isArray(input)) {
    return input;
  } else if (typeof input === "string") {
    return input
      .replace(/"/g, "") // Remove all double quotes
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  } else {
    return [];
  }
};

module.exports={ensureArray}