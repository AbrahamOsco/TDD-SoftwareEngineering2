import { ArgumentEmptyOnOperationError } from "../../exceptions/callValueExceptions";
import { BaseValue } from "../BaseTypeValues/BaseValue";
import { Value } from "../Values/Value";
import { Variables } from "../Variables/Variables";

export abstract class CallFunction{
    
    protected validateArgument(values: Value[]){
        if(values.length == 0 ){
            throw new ArgumentEmptyOnOperationError();
        }
    }
    public async setValue(variableName: string, values: Value[]): Promise<void> {
        this.validateArgument(values);
        Variables.getInstance().setVariable(variableName, await this.getBasicValue(values));
    }

    public abstract getAmount(values: Value[]): Promise<number>;

    protected abstract getBasicValue(values: Value[]) :Promise<BaseValue>;

    public abstract evaluate(values :Value[]): Promise<boolean>;

    public abstract getValue(values: Value[]): Promise< number | boolean>;
    

}
