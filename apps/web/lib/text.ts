/** "forms" → "Forms". */
export const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** A slug as a label: "empty-state" → "Empty state". */
export const titleCase = (slug: string) => capitalize(slug.replaceAll("-", " "));

/** "1 component", "30 components". */
export const plural = (count: number, noun: string) => `${count} ${noun}${count === 1 ? "" : "s"}`;
