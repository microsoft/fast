import FormItemBase from "../../utilities/form-item.base";

export interface FormItemConfig<D> {
    /**
     * The onChange update for the data
     */
    onUpdate: (value: D) => void;
}

export default class FormItem<H, D, U, S> extends FormItemBase<
    H & FormItemConfig<D>,
    D,
    U,
    S
> {
    private cache: D;

    public handleSoftRemove = (): void => {
        if (typeof this.props.data !== "undefined") {
            this.cache = this.props.data;

            return this.props.onUpdate(undefined);
        } else {
            return this.props.onUpdate(this.cache);
        }
    };

    public handleChange = (data: D): void => {
        return this.props.onUpdate(data);
    };
}
