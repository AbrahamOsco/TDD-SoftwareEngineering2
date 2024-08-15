import { Value } from "../../Values/Value";
import { BooleanFunciton } from "../BooleanFunction";

export class And extends BooleanFunciton{

    public async getValue(values: Value[]): Promise<boolean>{
        this.validateArgument(values);
        const arrayBoolean = await Promise.all(values.map( (aValue) => {return aValue.evaluate()} ));
        return arrayBoolean.every(Boolean);
    }
}
