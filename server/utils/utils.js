const randomDate = (start, end) => {
  const longDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return Date.parse(longDate) / 1000;
}

// console.log(randomDate(new Date(2012, 0, 1), new Date()));

module.exports = {
  randomDate
}