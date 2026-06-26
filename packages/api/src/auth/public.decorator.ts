import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key used to mark routes as publicly accessible.
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marks an endpoint or controller as accessible without JWT authentication.
 *
 * @returns A metadata decorator recognized by the JWT auth guard.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
