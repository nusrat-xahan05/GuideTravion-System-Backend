import { TourModel } from "../modules/tour/tour.model";
import slugify from "slugify";


export const generateUniqueSlug = async (title: string) => {
    const baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    while (await TourModel.findOne({ slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
};