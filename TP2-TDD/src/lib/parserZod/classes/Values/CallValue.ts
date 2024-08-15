import { CallArguments } from "../CallArguments/CallArguments";
import { And } from "../Functions/BooleanFunctions/And";
import { Distinct } from "../Functions/BooleanFunctions/Distinct";
import { Equals } from "../Functions/BooleanFunctions/Equals";
import { Not } from "../Functions/BooleanFunctions/Not";
import { Or } from "../Functions/BooleanFunctions/Or";
import { CallFunction } from "../Functions/CallFunction";
import { Average } from "../Functions/NumericalFunctions/NumberCalculationFunction/Average";
import { Greater } from "../Functions/NumericalFunctions/ComparisonManyNumbers/Greater";
import { GreaterOrEquals } from "../Functions/NumericalFunctions/ComparisonManyNumbers/GreaterOrEquals";
import { Lesser } from "../Functions/NumericalFunctions/ComparisonManyNumbers/Lesser";
import { LesserOrEquals } from "../Functions/NumericalFunctions/ComparisonManyNumbers/LesserOrEquals";
import { Division } from "../Functions/NumericalFunctions/NumberCalculationFunction/Division";
import { First } from "../Functions/NumericalFunctions/NumberCalculationFunction/First";
import { Last } from "../Functions/NumericalFunctions/NumberCalculationFunction/Last";
import { Maximum } from "../Functions/NumericalFunctions/NumberCalculationFunction/Maximun";
import { Minimum } from "../Functions/NumericalFunctions/NumberCalculationFunction/Minimun";
import { Multiply } from "../Functions/NumericalFunctions/NumberCalculationFunction/Multiply";
import { Negate } from "../Functions/NumericalFunctions/NumberCalculationFunction/Negate";
import { StandardDeviation } from "../Functions/NumericalFunctions/NumberCalculationFunction/StandardDeviation";
import { Subtraction } from "../Functions/NumericalFunctions/NumberCalculationFunction/Subtraction";
import { SumCall } from "../Functions/NumericalFunctions/NumberCalculationFunction/SumCall";
import { Value } from "./Value";
import { AND, AVERAGE, DISTINCT, DIVIDE, EQUALS, FIRST, GREATER_THAN, GREATER_THAN_OR_EQUAL, LAST, LESS_THAN, LESS_THAN_OR_EQUAL, MAX, MIN, MULTIPLY, NEGATE, NOT, OR, PLUS, STDDEV, SUBTRACTION } from "../../constant/constant";

export class CallValue implements Value{
    private functionName:string;
    private arrayArguments: CallArguments;
    private static readonly EQUALS: string = EQUALS;
    private static readonly DISTINCT: string = DISTINCT;
    private static readonly LESS_THAN: string = LESS_THAN;
    private static readonly LESS_THAN_OR_EQUAL: string = LESS_THAN_OR_EQUAL;
    private static readonly GREATER_THAN: string = GREATER_THAN;
    private static readonly GREATER_THAN_OR_EQUAL: string = GREATER_THAN_OR_EQUAL;
    private static readonly NEGATE: string = NEGATE;
    private static readonly SUBTRACTION: string = SUBTRACTION;
    private static readonly DIVIDE: string = DIVIDE;
    private static readonly PLUS: string = PLUS;
    private static readonly MULTIPLY: string = MULTIPLY;
    private static readonly MIN: string = MIN;
    private static readonly MAX: string = MAX;
    private static readonly AVERAGE: string = AVERAGE;
    private static readonly STDDEV: string = STDDEV;
    private static readonly FIRST: string = FIRST;
    private static readonly LAST: string = LAST;
    private static readonly NOT: string = NOT;
    private static readonly AND: string = AND;
    private static readonly OR: string = OR;

    private functions = new Map<string, CallFunction>();

    public constructor( functionName:string, arrayArguments:CallArguments){
        this.functionName = functionName;
        this.arrayArguments = arrayArguments;
        this.addFunctions();
    }

    public async getValue(): Promise<number | boolean> {
        return await this.arrayArguments.getValue(this.functions.get(this.functionName));
    }
    
    public async evaluate(): Promise<boolean>{
        return await this.arrayArguments.beEvaluatedBy(this.functions.get(this.functionName));
    }

    public async setValueInVariables(variableName: string): Promise<void> {
        return this.arrayArguments.setValue(variableName, this.functions.get(this.functionName));        
    }

    public async getAmount(): Promise<number> {
        return await this.arrayArguments.getAmount(this.functions.get(this.functionName));
    }
    
    private addFunctions(){
        this.functions.set(CallValue.EQUALS, new Equals());
        this.functions.set(CallValue.MULTIPLY, new Multiply());
        this.functions.set(CallValue.DISTINCT, new Distinct());
        this.functions.set(CallValue.LESS_THAN, new Lesser());
        this.functions.set(CallValue.LESS_THAN_OR_EQUAL, new LesserOrEquals());
        this.functions.set(CallValue.GREATER_THAN, new Greater());
        this.functions.set(CallValue.GREATER_THAN_OR_EQUAL, new GreaterOrEquals());
        this.functions.set(CallValue.NEGATE, new Negate());
        this.functions.set(CallValue.DIVIDE, new Division());
        this.functions.set(CallValue.SUBTRACTION, new Subtraction());
        this.functions.set(CallValue.PLUS, new SumCall());
        this.functions.set(CallValue.MIN, new Minimum());
        this.functions.set(CallValue.MAX, new Maximum());
        this.functions.set(CallValue.AVERAGE, new Average());
        this.functions.set(CallValue.STDDEV, new StandardDeviation());
        this.functions.set(CallValue.FIRST, new First());
        this.functions.set(CallValue.LAST, new Last());
        this.functions.set(CallValue.NOT, new Not());
        this.functions.set(CallValue.AND, new And());
        this.functions.set(CallValue.OR, new Or());
    }
    
}