import { ValueOfTheVariableDoesNotExistError } from "../../exceptions/variablesExceptions";
import { BaseValue } from "../BaseTypeValues/BaseValue";

export class Variables{
    private static instance: Variables;
    private variables: { [key:string] : BaseValue} = {};

    private constructor(){}
    
    public static reset(){
        this.instance = null; 
    }

    public static getInstance(){
        if (this.instance){
            return this.instance;
        }
        this.instance = new Variables();
        return this.instance;
    }

    public insert(key:string, baseValue: BaseValue){
        this.variables[key] = baseValue;
    }

    public getValue(aName:string){
        return this.findVariable(aName).getValue();
    }

    public findVariable(aName: string): BaseValue{
        const baseValue = this.variables[aName];
        if(baseValue === undefined){
            throw new ValueOfTheVariableDoesNotExistError("The Variable Does Not Exist Error");
        }
        return baseValue
    }

    public setVariable(variableName: string, aValue: BaseValue){
        this.variables[variableName] = aValue;
    }
    
    public evaluate(aName: string): boolean {
        return this.findVariable(aName).evaluate();
    }

    public async getAmount(variableName: string): Promise<number> {
        return await this.findVariable(variableName).getAmount();
    }

}