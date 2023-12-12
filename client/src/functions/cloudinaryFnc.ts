import { Cloudinary } from "@cloudinary/url-gen/index";

export const cloudinaryFnc = () => {
    const cld = new Cloudinary({
        cloud: {
          cloudName: "ddfyjnala",
        },
      });
    return cld;
}