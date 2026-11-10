/** GitHub avatars are sized at 2× the display size. */
export const sizedAvatar = (src: string, px: number) => `${src}${src.includes("?") ? "&" : "?"}s=${px * 2}`;
