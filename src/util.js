// Function that Construct name with judging Engish/not
function formatName(firstName, lastName) {
    // Check if firstName contains any English Chars
    if (/[a-zA-Z]/.test(firstName)) {
        return `${firstName} ${lastName}`;
    } else {
        return `${lastName}${firstName}`;
    }
}

module.exports = { formatName };
