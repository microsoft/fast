/**
 * Select class name contract
 */
export interface FormCategoryClassNameContract {
    formCategory_button: string;
    formCategory_header: string;
    formCategory__collapsed: string;
}

/**
 * Select state interface
 */
export interface FormCategoryProps {
    /**
     * Passes the category title
     */
    title: string;

    /**
     * Is the category expandable
     */
    expandable?: boolean;

    /**
     * Passes the id
     */
    id?: string;
}

export interface FormCategoryState {
    expanded?: boolean;
}
