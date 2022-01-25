import { ExpressionEvaluator } from "./Expressions/ExpressionEvaluator.js";
import { ExpressionFormatter } from "./Expressions/ExpressionFormatter.js";
import { ExpressionParser } from "./Expressions/ExpressionParser.js";
import { Calculator } from "./Calculator.js";

let isNumeric = x => {
    return (x >= "0" && x <= "9") || x == "." || x == "e";
}

let operatorSymbols = ["^","×","÷","+","-"]

let parser = new ExpressionParser(isNumeric);
let formatter = new ExpressionFormatter(isNumeric, operatorSymbols);
let evaluator = new ExpressionEvaluator(parser.MathOperators);
ReactDOM.render(<Calculator parser={parser} formatter={formatter} evaluator={evaluator} />, document.getElementById("root"));