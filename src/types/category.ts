/**
 * Category domain model.
 * Unifies public Category (home) and AdminCategory (admin panel).
 */

export type CategoryIconName =
  | 'code'
  | 'briefcase'
  | 'rocket'
  | 'music'
  | 'palette'
  | 'camera'
  | 'bulb';

/** Fields shared by every category representation. */
export interface CategoryCore {
  id: string;
  name: string;
  eventCount: number;
}

/**
 * Public-facing category (home, filters, footer).
 * Formerly `Category` in components/home/types.ts.
 */
export interface Category extends CategoryCore {
  icon: CategoryIconName;
}

/**
 * Admin-managed category with CMS fields.
 * Formerly `AdminCategory` in components/admin/types.ts.
 */
export interface CategoryAdmin extends CategoryCore {
  slug: string;
  description: string;
  isActive: boolean;
  icon?: CategoryIconName;
}

/** Category with all optional fields from public + admin contexts. */
export type CategoryFull = CategoryCore & {
  icon?: CategoryIconName;
  slug?: string;
  description?: string;
  isActive?: boolean;
};
