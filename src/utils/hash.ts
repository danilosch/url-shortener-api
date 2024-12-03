import { createHash } from "crypto";

// Função para gerar hash de 6 caracteres
export const generateHash = (input: string): string => {
  return createHash("sha256")
    .update(input)
    .digest("base64")
    .replace(/[+/=]/g, "") // Remove caracteres inválidos para URL
    .slice(0, 6);
};
