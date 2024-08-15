export interface Value{
    
    getValue() : Promise<string | number | boolean>;
    getAmount(): Promise<number>;
    evaluate(): Promise<boolean>;
    setValueInVariables(variableName: string): Promise<void>;
}