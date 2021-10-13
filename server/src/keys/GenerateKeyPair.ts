import { generateKeyPairSync } from 'crypto';
import { writeFileSync } from 'fs';

import { PRIVATE_KEY_PATH, PUBLIC_KEY_PATH } from '../Const';

generateKeyPair();

function generateKeyPair() {
	const keyPair = generateKeyPairSync('rsa', {
		modulusLength: 4096,
		publicKeyEncoding: {
			type: 'pkcs1', // "Public Key Cryptography Standards 1"
			format: 'pem', // Most common formatting choice
		},
		privateKeyEncoding: {
			type: 'pkcs1', // "Public Key Cryptography Standards 1"
			format: 'pem', // Most common formatting choice
		},
	});

	writeFileSync(PUBLIC_KEY_PATH, keyPair.publicKey);
	writeFileSync(PRIVATE_KEY_PATH, keyPair.privateKey);
}
