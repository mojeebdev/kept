import { createShareImage } from "./share-image";

export const size = { height: 630, width: 1200 };
export const contentType = "image/png";

export default function TwitterImage() {
  return createShareImage();
}
