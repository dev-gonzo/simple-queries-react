export const isURL = (str: string) => {
  const urlRegex = /^(?:http|https):\/\/\S+/i;
  return urlRegex.test(str);
};
