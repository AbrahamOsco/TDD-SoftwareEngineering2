import { ComparisionManyNumbers } from "./ComparisonManyNumbers";

export class Lesser extends ComparisionManyNumbers{
    
    protected getLogicalCondition(numberValues: number[], index: number): boolean {
        return !(numberValues[index] < numberValues[index+1]);
    }    
}