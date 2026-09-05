import {
  z,
} from 'zod';


export const updateProfileSchema =
  z.object({

    name: z
      .string()
      .trim()
      .min(
        2,
        'Name must contain at least 2 characters',
      )
      .max(
        100,
        'Name must not exceed 100 characters',
      )
      .optional(),

    email: z
      .string()
      .trim()
      .email(
        'Invalid email address',
      )
      .or(z.literal(''))
      .optional(),

    profileImage: z
      .string()
      .trim()
      .url(
        'Invalid profile image URL',
      )
      .or(z.literal(''))
      .optional(),

  });


export type UpdateProfileSchemaInput =
  z.infer<
    typeof updateProfileSchema
  >;