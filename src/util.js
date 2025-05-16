// Function that Construct name with judging Engish/not
function formatName(firstName, lastName) {
    // Check if firstName contains any English Chars
    if (/[a-zA-Z]/.test(firstName)) {
        return `${firstName} ${lastName}`;
    } else {
        return `${lastName}${firstName}`;
    }
}

// Function that turns a ISO time into ENglish human readable time
function ISO2Date(isoString) {
  const date = new Date(isoString);

  const options = { year: 'numeric', month: 'long', day: '2-digit' };
  const formattedDate = date.toLocaleDateString('en-US', options);

  return formattedDate;
}

module.exports = { formatName, ISO2Date };
