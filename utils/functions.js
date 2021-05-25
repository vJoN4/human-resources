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

const fieldsToReview = (bodyLength, blankFields, numFields) => (bodyLength == numFields) ? numFields - blankFields : (blankFields) ? blankFields + numFields - bodyLength : numFields - bodyLength;


module.exports = { handleBlankFields, fieldsToReview };