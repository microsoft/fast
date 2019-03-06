/* tslint:disable-next-line */
export interface FormOneOfAnyOfState {}

export interface FormOneOfAnyOfProps {
    label: string;
    activeIndex: number;
    onUpdate: (activeIndex: number) => void;
}

export interface FormOneOfAnyOfClassNameContract {
    formOneOfAnyOf?: string;
    formOneOfAnyOf_label?: string;
    formOneOfAnyOf_selectSpan?: string;
    formOneOfAnyOf_select?: string;
}
