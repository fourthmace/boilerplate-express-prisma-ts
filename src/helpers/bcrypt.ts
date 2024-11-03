// libs
import bcrypt from "bcrypt";

/**
 * Hash Text
 *
 * Make hash from any text
 */
export const hashText = (text: string) => {
  try {
    const saltRound = 10;
    const salt = bcrypt.genSaltSync(saltRound);
    const hash = bcrypt.hashSync(text, salt);
    return hash;
  } catch (error) {
    console.error("error - hashText - bcrypt.ts:", error);
    throw new Error("hashText error");
  }
};

/**
 * Compare Text
 *
 * Compare between normal text and hash text
 */
export const compareText = (text: string, hashText: string) => {
  try {
    return bcrypt.compareSync(text, hashText);
  } catch (error) {
    console.error("error - compareText - bcrypt.ts:", error);
    throw new Error("compareText error");
  }
};
