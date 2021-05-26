const handleBlankFields = (keys=[], request) => {
  let notBlankFields = true;
  let blankFields = 0;
  keys.map(oKey => {
    if (request.body[oKey] === "") {
      notBlankFields = false;
      blankFields += 1;
    }
  });
  return {notBlankFields, blankFields};
};

const fieldsToReview = (bodyLength, blankFields, numFields) => (bodyLength === numFields) ? (numFields === blankFields) ? numFields : blankFields : (numFields - bodyLength)  + blankFields;

module.exports = { handleBlankFields, fieldsToReview };