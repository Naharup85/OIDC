import { z } from "zod";

export const registerDto = z.object({
    clientId: z.string({message:"Client ID is required"}),
    firstName: z.string({message:"First name is required"}).min(1, 'First name is required').max(255, 'First name cannot exceed 255 characters'),
    lastName: z.string({message:"Last name is required"}).min(1, 'Last name is required').max(255, 'Last name cannot exceed 255 characters'),
    email: z.string({message:"Email is required"}).email('Invalid email address').min(5, 'Email is required').max(255, 'Email cannot exceed 255 characters'),
    password: z.string({message:"Password is required"}).min(8, 'Password must be at least 8 characters long').max(255, 'Password cannot exceed 255 characters'),
    redirectUri: z.string({message:"Redirect URI is required"}),
});

export type RegisterDto = z.infer<typeof registerDto>;
