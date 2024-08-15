import { ComparisionManyNumbers } from "./ComparisonManyNumbers";

export class Greater extends ComparisionManyNumbers{
    
    protected getLogicalCondition(numberValues: number[], index: number): boolean {
        return !(numberValues[index] > numberValues[index+1]);
    }
}