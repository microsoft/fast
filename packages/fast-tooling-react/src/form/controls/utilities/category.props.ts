/**
 * Select class name contract
 */
export interface CategoryClassNameContract {
    category_button: string;
    category_header: string;
    category__collapsed: string;
}

/**
 * Select state interface
 */
export interface CategoryProps {
    /**
     * Passes the category title
     * If the title is null, this should not render in a category
     */
    title: string | null;

    /**
     * Is the category expandable
     */
    expandable?: boolean;
}

export interface CategoryState {
    expanded?: boolean;
}
