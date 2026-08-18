import type { User, UserRole } from '../types';

export type PermissionAction =
  | 'products.view'
  | 'products.create'
  | 'products.edit'
  | 'products.publish'
  | 'products.delete'
  | 'news.view'
  | 'news.create'
  | 'news.edit'
  | 'news.publish'
  | 'news.delete'
  | 'jobs.view'
  | 'jobs.create'
  | 'jobs.edit'
  | 'jobs.publish'
  | 'jobs.delete'
  | 'applications.view'
  | 'applications.status'
  | 'applications.cv'
  | 'enquiries.view';

const ROLE_PERMISSIONS: Record<UserRole, PermissionAction[]> = {
  ADMIN: [
    'products.view',
    'products.create',
    'products.edit',
    'products.publish',
    'products.delete',
    'news.view',
    'news.create',
    'news.edit',
    'news.publish',
    'news.delete',
    'jobs.view',
    'jobs.create',
    'jobs.edit',
    'jobs.publish',
    'jobs.delete',
    'applications.view',
    'applications.status',
    'applications.cv',
    'enquiries.view',
  ],
  EDITOR: [
    'products.view',
    'products.create',
    'products.edit',
    'products.publish',
    'news.view',
    'news.create',
    'news.edit',
    'news.publish',
    'jobs.view',
    'jobs.create',
    'jobs.edit',
    'jobs.publish',
    'applications.view',
    'applications.status',
    'applications.cv',
    'enquiries.view',
  ],
};

/**
 * Role-aware permission check helper reflecting verified backend authorization rules.
 */
export function can(action: PermissionAction, user?: User | null): boolean {
  if (!user || !user.role) return false;
  const permissions = ROLE_PERMISSIONS[user.role];
  return permissions ? permissions.includes(action) : false;
}
