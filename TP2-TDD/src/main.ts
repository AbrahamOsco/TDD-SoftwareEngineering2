import { config } from 'dotenv';
config();
import { Log } from "./lib/logger/Log";
import { RuleEngine } from "./lib/parserZod/classes/RuleEngine/RuleEngine";

const main = () => {
  const ruleName = process.env.BOT_CONFIG;
  Log.info(`Cryptobot starting 🤖 with ${ruleName}`)
  if (!ruleName) {
    throw new Error("No path to bot configuration JSON file provided. Make sure you load the path with the environment variable BOT_CONFIG.")
  }
  const ruleEngine = new RuleEngine(ruleName);
  ruleEngine.start();
};

main();
