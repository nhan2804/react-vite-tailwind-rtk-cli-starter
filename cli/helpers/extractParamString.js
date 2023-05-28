const extractParamString = (inputString) => {
  const regex = /\${([^}]+)}/g;

  // Extract all parameters using matchAll()
  const matches = [...inputString?.matchAll(regex)];

  // Extracted parameters will be available in the matches array
  const params = matches.map((match) => match[1]);
  return params;
};
module.exports = {
  extractParamString,
};
