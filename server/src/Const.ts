import { join } from 'path';

export const DEBUG_PATH = join(__dirname, 'debug.log');
export const PUBLIC_KEY_PATH = join(__dirname, 'keys', 'rsa_public.pem');
export const PRIVATE_KEY_PATH = join(__dirname, 'keys', 'rsa_private.pem');
