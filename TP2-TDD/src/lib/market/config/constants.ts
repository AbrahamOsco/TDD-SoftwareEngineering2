import { config } from "dotenv";
config(); // Cargar las variables de entorno desde el archivo .env

export const HISTORY_INTERVAL = 60 * 60 * 1000; // 1 hora en milisegundos
export const SIGNIFICANT_CHANGE_THRESHOLD = Number(
  process.env.SIGNIFICANT_CHANGE_THRESHOLD,
); // 0.1%
