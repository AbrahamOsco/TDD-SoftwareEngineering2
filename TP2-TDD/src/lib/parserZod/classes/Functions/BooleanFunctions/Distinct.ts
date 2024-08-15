import { Value } from "../../Values/Value";
import { BooleanFunciton } from "../BooleanFunction";

export class Distinct extends BooleanFunciton{
    
    public async getValue(values: Value[]): Promise<boolean> {
        if (values.length == 1){
            return true;
        }
        const valuesObtain = await this.getArrayBasicValues(values);        
        const setValues = new Set(valuesObtain);
        return setValues.size === valuesObtain.length;
    }

}