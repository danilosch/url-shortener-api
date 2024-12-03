import { z } from "zod";

export const urlValidator = z.object({
  url: z.string().url({ message: "Invalid URL format" }),
});
