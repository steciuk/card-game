export type AuthFormResponse = {
	expiresIn: string;
	token: string;
	user: { id: string; username: string };
};
