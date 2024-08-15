import { join } from "path";
import { readFileSync } from "fs";
import { InvalidFormatFoundInJsonError } from "../../exceptions/variablesExceptions";
import { SchemaFactory } from "./SchemaFactory";
import { Variables } from "../Variables/Variables";
import { Rule } from "../Rule/Rule";
import { Log } from "../../../logger/Log";

export class ZodParser{
    rules: Rule[] = [];
    
    public constructor(ruleName:string){
        let finalPath = ruleName
        if(!ruleName.includes("/mocks")){
            finalPath = this.getPath(ruleName);
        }
        const dataJson = this.getParseJson(finalPath);
        this.initializeVariables(dataJson.variables);
        this.initializeRules(dataJson.rules);
    }

    private getPath(ruleName:string){
        if(!ruleName){
            Log.error("You need to enter the name of the json file in the .env. example: RULE_NAME = aRule.json  ");
            process.exit(1);    
        }
        const path = __dirname + "/../../../../../rules/" + ruleName
        return path;
    }

    private getParseJson(path:string){
        const filePath = join(path);
        const data = readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    }

    private initializeVariables(dataVariables){
        const variableSchema = SchemaFactory.createVariableSchema();
        try{
            const resultParsed = variableSchema.parse(dataVariables);
            for (const key in resultParsed) {
                const value = resultParsed[key];
                Variables.getInstance().insert(key, value)
            }
        } catch (e){
            throw new InvalidFormatFoundInJsonError("invalid format found in json error ❌");
        }
    }
    
    private initializeRules(dataRules : []) {
        if (dataRules === undefined || dataRules.length == 0) {
            throw new InvalidFormatFoundInJsonError("There is no rule ending the program.");
        }
        const ruleSchema = SchemaFactory.createRuleSchema();
        try {
            this.rules = ruleSchema.parse(dataRules);
        } catch (e) {
            throw new InvalidFormatFoundInJsonError("invalid format found in json error ❌");
        }
    }

    public getRules(): Rule[]{
        return this.rules;
    }
    
}