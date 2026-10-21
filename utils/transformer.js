import { encode, decode } from "js-base64";

export const encodeData = (obj) => {
  return encode(JSON.stringify(obj));
};

// Returns the decoded profile object, or null when the URL data is missing or invalid.
export const decodeData = (base64) => {
  if (typeof base64 !== "string" || !base64) return null;
  try {
    const data = JSON.parse(decode(base64));
    return data && typeof data === "object" && !Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
};
