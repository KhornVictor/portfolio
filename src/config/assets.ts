import { env } from "./env.config";

export function imageUrl(file: string): string {
  return `${env.imageBase}/${file.replace(/^\//, "")}`;
}
