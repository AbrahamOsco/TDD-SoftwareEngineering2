import { CallFunction } from "../Functions/CallFunction";

export interface CallArguments{
    getAmount(aFunctionCall: CallFunction): Promise<number>;
    setValue(variableName:string, aFunctionCall: CallFunction): Promise<void>;
    beEvaluatedBy(aFunctionCall: CallFunction): Promise<boolean>;
    getValue(aFunctionCall: CallFunction): Promise<number | boolean>;
}
