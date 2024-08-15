import { Action } from "../Actions/Action";
import { Condition } from "../Condition/Condition";

export class Rule{
    private ruleName: string;
    private condition: Condition;
    private actions: Action[];

    public constructor(ruleName:string, condition: Condition, actions: Action[]){
        this.ruleName = ruleName;
        this.condition = condition;
        this.actions = actions;
    }
    
    public getName(): string{
        return this.ruleName
    }
    
    public async evaluate(): Promise<Boolean>{
        return await this.condition.evaluate();
    }
    
    public async tryApplyActions() :Promise<void> {
        if (await this.condition.evaluate() == false){
            return;
        }
        await Promise.all(this.actions.map( (aAction) => aAction.apply()));
    }
    
    public getActions(): Action[]{
        return this.actions;
    }
}