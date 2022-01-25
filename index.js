import ExpressionEvaluator from "./Expressions/ExpressionEvaluator";
import ExpressionFormatter from "./Expressions/ExpressionFormatter";
import ExpressionParser from "./Expressions/ExpressionParser";
import Calculator from "./Calculator";

let isNumeric = x => {
    return (x >= "0" && x <= "9") || x == "." || x == "e";
}

let operatorSymbols = ["^","×","÷","+","-"]

let parser = new ExpressionParser(isNumeric);
let formatter = new ExpressionFormatter(isNumeric, operatorSymbols);
let evaluator = new ExpressionEvaluator(parser.MathOperators);
ReactDOM.render(`<Calculator parser={parser} formatter={formatter} evaluator={evaluator} />`, document.getElementById("root"));