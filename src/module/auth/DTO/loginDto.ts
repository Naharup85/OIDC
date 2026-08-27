import {z} from 'zod';

export const loginDto=z.object({
    email:z.string({message:"Email is required"}).email('Invalid email address').min(5, 'Email is required').max(255, 'Email cannot exceed 255 characters'),
    password:z.string({message:"Password is required"}).min(8, 'Password must be at least 8 characters long').max(255, 'Password cannot exceed 255 characters'),
});

export type LoginDto = z.infer<typeof loginDto>;
