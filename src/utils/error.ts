export const documentNotFound = (name: string) => {
 return new Error(`${name} is not found`);
};
