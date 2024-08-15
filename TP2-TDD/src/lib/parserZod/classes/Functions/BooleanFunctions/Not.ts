import { NotFunctionShouldOnlyHaveOneArgumentException } from "../../../exceptions/functionsExceptions";
import { Value } from "../../Values/Value";
import { BooleanFunciton } from "../BooleanFunction";

export class Not extends BooleanFunciton{

    public async getValue(values: Value[]): Promise<boolean>{
        if (values.length !== 1) {
            throw new NotFunctionShouldOnlyHaveOneArgumentException();
        }
        this.validateArgument(values);
        const arrayBoolean = await Promise.all(values.map( (aValue) => {return aValue.evaluate()} ));
        return !arrayBoolean[0];
    }
}