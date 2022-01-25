class ExpressionParser {
    #parsedExpression = null;

    ParseMathStatement = (input) => {
        let output = [];
        let lastChar = "";

        for (let i = 0; i < input.length; i++) {
            if (i > 0) lastChar = input[i - 1];

            let number = "";
            if ((input[i] == "-") && (lastChar == "" || lastChar in this.operatorFunctions)) {
                number = "-";
                i++;
            }

            if (this.isNumeric(input[i]) || input[i] == "√") {
                while ((input[i] != undefined) && (this.isNumeric(input[i]) || (input[i] in this.symbolFunctions))) {
                    number += input[i];
                    i++;
                }
                i--;

                if (((input[i] in this.symbolFunctions) || (number[0] in this.symbolFunctions))) {
                    number = this.symbolFunctions[input[i]](number);
                }

                output.push(number);
                continue;
            }

            if ((input[i] in this.operatorFunctions) &&!(lastChar in this.operatorFunctions) && (lastChar != "")) {
                output.push(this.operatorFunctions[input[i]]);
                continue;
            }

            if (input[i] != "e" && (input[i].toLowerCase() >= "a" && input[i].toLowerCase() <= "z")) {
                let functionName = "";
                for (; input[i] != "("; i++) {
                    functionName += input[i];
                }

                let innerExpression = "";
                let levels = 1;
                i++;
                for (; levels > 0; i++) {
                    if (input[i] == "(") levels++;
                    else if (input[i] == ")") levels--;

                    if (levels > 0)
                        innerExpression += input[i];
                }

                let parsedInner = this.parseMathStatement(innerExpression);
                let evaluatedInner = this.evaluateStatement(parsedInner);
                output.push(this.mathFunctions[functionName](evaluatedInner));
                continue;
            }

            if (input[i] == "(") {
                i++;
                let levels = 1;
                let parenthEnd = i;
                for (; i < input.length; parenthEnd++) {
                    if (input[parenthEnd] == "(") {
                        levels++;
                    } else if (input[parenthEnd] == ")") {
                        levels--;
                        if (levels == 0) {
                            break;
                        }
                    }
                }

                let parenthStatement = input.substring(i, parenthEnd);
                output.push(this.parseMathStatement(parenthStatement));
                i = parenthEnd;
                continue;
            }

            if (input[i] == "π") {
                output.push(Math.PI);
            }
        }

        return output;
    };
}
