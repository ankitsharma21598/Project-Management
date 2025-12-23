import dotenv from 'dotenv';
import { SignOptions } from 'jsonwebtoken';

dotenv.config();

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: SignOptions['expiresIn'];
  CORS_ORIGIN: string;
}

function getEnvVariable(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const config: EnvConfig = {
  NODE_ENV: getEnvVariable('NODE_ENV', 'development'),
  PORT: parseInt(getEnvVariable('PORT', '4000'), 10),
  DB_HOST: getEnvVariable('DB_HOST', 'localhost'),
  DB_PORT: parseInt(getEnvVariable('DB_PORT', '5432'), 10),
  DB_NAME: getEnvVariable('DB_NAME'),
  DB_USER: getEnvVariable('DB_USER'),
  DB_PASSWORD: getEnvVariable('DB_PASSWORD'),
  JWT_SECRET: getEnvVariable('JWT_SECRET'),
  JWT_EXPIRES_IN: getEnvVariable(
    'JWT_EXPIRES_IN',
    '7d'
  ) as SignOptions['expiresIn'],
  CORS_ORIGIN: getEnvVariable('CORS_ORIGIN', 'http://localhost:5173')
};