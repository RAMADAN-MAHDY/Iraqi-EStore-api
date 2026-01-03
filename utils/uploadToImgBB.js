import axios from "axios";
import qs from "qs";
import dotenv from "dotenv";

dotenv.config();

const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

const uploadToImgBB = async (buffer) => {
  try {
    const imageBase64 = buffer.toString("base64");

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      qs.stringify({ image: imageBase64 }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.data && response.data.data && response.data.data.url) {
      return {
        url: response.data.data.url,
        deleteUrl: response.data.data.delete_url || null,
      };
    } else {
      throw new Error("ImgBB upload did not return a valid URL");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "ImgBB Upload Error:",
        error.response?.data || error.message
      );
    } else if (error instanceof Error) {
      console.error("ImgBB Upload Error:", error.message);
    } else {
      console.error("ImgBB Upload Error:", error);
    }
    throw new Error("Image upload failed");
  }
};

export default uploadToImgBB;
