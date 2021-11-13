import { join } from 'path';

export const DEBUG_PATH = join(__dirname, 'temp', 'debug.log');
export const PUBLIC_KEY_PATH = join(__dirname, 'keys', 'rsa_public.pem');
export const PRIVATE_KEY_PATH = join(__dirname, 'keys', 'rsa_private.pem');

export const ALPHANUMERIC_UNDERSCORE_REGEX = /^[a-zA-Z0-9_]+$/;
export const ALPHANUMERIC_SPECIAL_REGEX = /^[a-zA-Z0-9!@#$%^&*]+$/;
