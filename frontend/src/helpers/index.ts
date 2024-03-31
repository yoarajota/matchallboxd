// Get only initials from a full name
export const stringInitialLetters = (name: string, maxLength: number = 0) => {
  const initials = name.match(/\b\w/g) || [];

  const str = initials.join("").toUpperCase();

  if (maxLength > 0) {
    return str.slice(0, maxLength);
  }

  return str;
};
