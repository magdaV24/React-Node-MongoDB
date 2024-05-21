import { Cloudinary } from "@cloudinary/url-gen/index";
import { CLOUD_NAME } from "./cloudinary";

export const cloudinaryFnc = () => {
    const cld = new Cloudinary({
        cloud: {
          cloudName: CLOUD_NAME,
        },
      });
    return cld;
}