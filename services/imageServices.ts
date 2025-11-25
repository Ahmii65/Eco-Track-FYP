import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
} from "@/constants/cloud";
import { ResponseType } from "@/types";
import axios from "axios";

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export const uploadToCloudinary = async (
  file: { uri?: string } | string,
  folderName: string
): Promise<ResponseType> => {
  try {
    if (!file) {
      return { success: true, data: null };
    }
    if (typeof file == "string") {
      return { success: true, data: file };
    }
    if (file && file.uri) {
      const formData = new FormData();
      formData.append("file", {
        uri: file?.uri,
        type: "image/jpeg",
        name: file?.uri.split("/").pop() || "file.jpg",
      } as any);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("cloud_name", CLOUDINARY_CLOUD_NAME);

      const res = await axios.post(CLOUDINARY_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return { success: true, data: res?.data?.secure_url };
    }

    return { success: true };
  } catch (error: any) {
    console.log(error.message);
    return { success: false, msg: error.message || "Upload failed" };
  }
};

export const getProfileImage = (file: any) => {
  if (file && typeof file === "string") {
    return file;
  }
  if (file && typeof file === "object") {
    return file.uri;
  }
  return require("../assets/images/defaultAvatar.png");
};
export const getfilePath = (file: any) => {
  if (file && typeof file === "string") {
    return file;
  }
  if (file && typeof file === "object") {
    return file.uri;
  }
  return null;
};
