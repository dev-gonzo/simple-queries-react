const generateRandomString = (length: number): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const generateHash = (): string => {
  const timestamp = new Date().getTime().toString();
  const randomString = generateRandomString(10); // Tamanho do string aleatório
  const hash = timestamp + "-" + randomString;
  return hash;
};
