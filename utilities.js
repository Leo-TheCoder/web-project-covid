const getDDMMYYYYFormat = (dateFormatted) => {
  var dd = String(dateFormatted.getDate()).padStart(2, "0");
  var mm = String(dateFormatted.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = dateFormatted.getFullYear();

  return dd + "/" + mm + "/" + yyyy;
};

module.exports = {
    getDDMMYYYYFormat,
}