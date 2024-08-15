import { Value } from "../../Values/Value";
import { BooleanFunciton } from "../BooleanFunction";

export class Equals extends BooleanFunciton{

    public async getValue(values: Value[]): Promise<boolean>{
        const valuesObtain = await this.getArrayBasicValues(values);        
        return valuesObtain.every((aValue) => aValue === valuesObtain[0]);
    }

}