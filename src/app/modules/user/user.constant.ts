export const guideSearchableFields = ["occupation", "verificationRequest", "city", "_id.languages", "_id.userStatus", "_id.email", "_id.country"];

export const guideNumericFields = ["yearsOfExperience", "hourlyRate", "dailyRate", "rating", "totalReviews"];

export const touristSearchableFields = ["languages", "userStatus", "user.email", "user.country"];

export const userFields = [
    "firstName", "lastName", "profileImage", "bio",
    "phone", "address", "country", "languages"
];

export const guideFields = [
    "occupation", "city", "expertise", "yearsOfExperience",
    "hourlyRate", "dailyRate"
];

export const touristFields = [
    "travelInterests", "preferredStyles"
];

export const verifyRequiredFieldsForGuide = ["firstName", "email", "profileImage", "bio",
    "phone", "address", "country", "occupation", "city", "expertise", "yearsOfExperience",
    "hourlyRate", "dailyRate"]
