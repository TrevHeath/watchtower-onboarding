export function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export function checkFieldIsDirty(dirtyFieldsArray, key) {
  return dirtyFieldsArray.filter((d) => d.includes(key))[0] || false;
}
