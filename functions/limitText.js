module.exports = (text, len = 80) => {
    return text.length <= len ? text : text.substring(0, len - 3) + "...";
}