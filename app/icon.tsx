import { createKeptIcon } from "./kept-icon";

export const size = { height: 512, width: 512 };
export const contentType = "image/png";

export default function Icon() {
  return createKeptIcon(size.width);
}
