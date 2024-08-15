export interface BaseValue{
    getValue(): string | number | boolean;
    getAmount(): Promise<number>;
    evaluate(): boolean;
}
