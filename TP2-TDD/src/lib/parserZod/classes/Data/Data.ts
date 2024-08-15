import { DataService } from "../../../market/services/DataService";
import { DataWithoutValueInHistoryOrDefaultException } from "../../exceptions/data.Exceptions";
import { NumberValue } from "../BaseTypeValues/NumberValue";
import { ConstantValue } from "../Values/ConstantValue";
import { Value } from "../Values/Value";

export class Data {
    
    private symbol: string;
    private from: number;
    private until: number;
    private defaultValues: Value[];

    public constructor(symbol:string, from:number, until:number, defaultValues: Value[] ){
        this.symbol = symbol.replace('/','');
        this.from = from;
        this.until = until;
        this.defaultValues = defaultValues;
    }

    public async getValues(): Promise<Value[]>{
        const numberValuesDefault  =  await Promise.all(this.defaultValues.map( (aValue) => { return aValue.getAmount()}));
        const arrayFinalNumber =  DataService.getInstance().getPricesInRange(this.symbol, this.from, this.until, numberValuesDefault);
        if(arrayFinalNumber.length == 0){
            throw new DataWithoutValueInHistoryOrDefaultException()
        }
        return arrayFinalNumber.map( (aNumber) => { return new ConstantValue(new NumberValue(aNumber))});
    }
}
