export const tourSearchableFieldsByOwner = ["tourType", "difficultyLevel", "status", "statusByAdmin"];
export const tourSearchableFieldsByAdmin = ["tourType", "difficultyLevel", "status"];
export const tourSearchableFields = ["tourType", "difficultyLevel", "status"];

export const BD_DIVISIONS = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Rangpur",
  "Khulna",
  "Barishal",
  "Mymensingh"
];

export type TBDDivision = (typeof BD_DIVISIONS)[number];