import { createKeptIcon } from "./kept-icon";

export const size = { height: 180, width: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return createKeptIcon(size.width);
}
