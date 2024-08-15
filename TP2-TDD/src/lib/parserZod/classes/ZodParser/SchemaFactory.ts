import z from "zod";
import { StringValue } from "../BaseTypeValues/StringValue";
import { NumberValue } from "../BaseTypeValues/NumberValue";
import { BooleanValue } from "../BaseTypeValues/BooleanValue";
import { ConstantValue } from "../Values/ConstantValue";
import { VariableValue } from "../Values/VariableValue";
import { WalletValue } from "../Values/WalletValue";
import { CallValue } from "../Values/CallValue";
import { Condition } from "../Condition/Condition";
import { Rule } from "../Rule/Rule";
import { BuyMarketAction } from "../Actions/BuyMarketAction";
import { SellMarketAction } from "../Actions/SellMarketAction";
import { SetVariableAction } from "../Actions/SetVariableAction";
import { Data } from "../Data/Data";
import { CallArgumentsArray } from "../CallArguments/CallArgumentsArray";
import { CallArgumentsData } from "../CallArguments/CallArgumentData";
import { AND, AVERAGE, DISTINCT, DIVIDE, EQUALS, FIRST, GREATER_THAN, GREATER_THAN_OR_EQUAL, LAST, LESS_THAN, LESS_THAN_OR_EQUAL, MAX, MIN, MULTIPLY, NEGATE, NOT, OR, PLUS, STDDEV, SUBTRACTION } from "../../constant/constant";

export class SchemaFactory{
    
    private constructor(){}

    private static createBaseTypesSchema(){
        return z.union([
            z.string().transform((value) => { return new StringValue(value) } ),
            z.number().transform((value) => { return new NumberValue(value) } ),
            z.boolean().transform((value) => { return new BooleanValue(value) })
        ]); 
    }

    public static createVariableSchema(){
        // Record espera un equema de valor, muchos valores dentro de un mismo objeto. 
        return z.record(this.createBaseTypesSchema());
    }
    
    private static createActionSchema(){
        return z.array(z.union([
            this.createBuyMarketActionSchema().transform((item) => { return new BuyMarketAction(item.symbol, item.amount)}),
            this.createSellMarketActionSchema().transform((item) => { return new SellMarketAction(item.symbol, item.amount)}),
            this.createSetVariableActionSchema().transform((item) => { return new SetVariableAction(item.name, item.value)}),
        ]))
    }

    private static createBuyMarketActionSchema(){
        return z.object({
            type: z.literal("BUY_MARKET"),
            symbol: z.string(),
            amount: this.createValueSchema()
        })
    }

    private static createSellMarketActionSchema(){
        return z.object({
            type: z.literal("SELL_MARKET"),
            symbol: z.string(),
            amount: this.createValueSchema()
        })
    }

    private static createSetVariableActionSchema(){
        return z.object({
            type: z.literal("SET_VARIABLE"),
            name: z.string(),
            value: this.createValueSchema()
        })
    }

    public static createRuleSchema(){
        return z.array(z.object({
            name: z.string(),
            condition: z.lazy(() => this.createValueSchema()) .transform((aCondition) => new Condition(aCondition))
                        .refine( (value) => (Object.keys(value).length > 0), {message: "Condition cannot be empty"}),
            action: this.createActionSchema().nonempty({message:" Action cannot be empty"})
        }).transform((aRule) => { return new Rule(aRule.name, aRule.condition, aRule.action) } )  )
    }
    
    private static createValueSchema(){
        return z.lazy( () => (z.union([
            this.createValueConst(),
            this.createValueVariable(),
            this.createValueWallet(),
            this.createValueCall()
        ])
        ))
    }

    private static createValueConst(){
        return z.object({
            type: z.literal("CONSTANT"),
            value: this.createBaseTypesSchema()
        }).transform((item) => { return new ConstantValue(item.value) } )
    }

    private static createValueVariable(){
        return z.object({
            type: z.literal("VARIABLE"),
            name: z.string()
        }).transform((item) => { return new VariableValue(item.name) } )
    }

    private static createValueWallet(){
        return z.object({
            type: z.literal("WALLET"),
            symbol: z.string()
        }).transform((item) => { return new WalletValue(item.symbol) } )
    }
    

    
    private static createDataSchema() {
        return z.object({
            type: z.literal("DATA"),
            symbol: z.string(),
            since: z.number(),
            until: z.number(),
            default: z.array(this.createValueSchema()).optional()
        }).transform((item) => new Data(item.symbol, item.since, item.until, item.default || [] ));
    }

    private static createValueCall(){
        return z.object({
            type: z.literal("CALL"),
            name: this.getEnumFunctions(),
            arguments: z.lazy(() => z.union([
                this.createDataSchema(),
                z.array(this.createValueSchema())
            ]))
        }).transform((item) => { 
            const args = Array.isArray(item.arguments)
            ? new CallArgumentsArray(item.arguments)
            : new CallArgumentsData(item.arguments)
            return new CallValue(item.name, args);  
        })
    }

    private static getEnumFunctions(){
        return z.enum([
            EQUALS, DISTINCT,
            LESS_THAN, LESS_THAN_OR_EQUAL, GREATER_THAN, GREATER_THAN_OR_EQUAL,
            NEGATE,
            SUBTRACTION, DIVIDE,
            PLUS, MULTIPLY, MIN, MAX, AVERAGE, STDDEV, FIRST, LAST,
            NOT, AND, OR
        ])
    }
}
