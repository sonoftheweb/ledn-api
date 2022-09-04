import mongoose from "mongoose";

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const isObjectId = (string: string) => {
  const typeIdentifier = mongoose.Types.ObjectId;
  return typeIdentifier.isValid(string);
};
