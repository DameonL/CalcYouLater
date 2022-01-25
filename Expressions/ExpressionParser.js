class ExpressionParser {
    #parsedExpression = null;
    #isNumeric = null;

    constructor(numericFunction) {
        this.#isNumeric = numericFunction;
    }

    #mathFunctions = {
        "Rad": (number) => (number * (Math.PI / 180)),
        "Deg": (number) => (number * (180 / Math.PI)),
        "sin": Math.sin,
        "cos": Math.cos,
        "tan": Math.tan,
        "ln": Math.log,
        "log": Math.log10,
    }

    #symbolFunctions = {
        "%": (number) => {
            return Number(number.replace("%", "")) * 0.01;
        },
        "√": (number) => {
            return Math.sqrt(Number(number.replace("√", "")));
        },
        "!": (number) => {
            let integer = Number(number.replace("!", ""));
            let factorial = 0;
            if (integer > 0) {
                factorial = 1;
                for (let i = 2; i <= integer; i++) {
                    factorial = factorial * i;
                }
                return factorial;
            }

            else if (integer < 0) {
                factorial = -1;
                for (let i = -2; i >= integer; i--) {
                    factorial = factorial * i;
                }
                return factorial;
            }

            return 0;
        },
    }

    #operatorFunctions = {
        "^": (a, b) => {
            return (a < 0) ? -(a ** b) : (a ** b);
        },
        "×": (a, b) => {
            return parseFloat(a) * parseFloat(b);
        },
        "÷": (a, b) => {
            return parseFloat(a) / parseFloat(b);
        },
        "+": (a, b) => {
            return parseFloat(a) + parseFloat(b);
        },
        "-": (a, b) => {
            return parseFloat(a) - parseFloat(b);
        }
    };

    #mathOperators = [
        [this.#operatorFunctions["^"]],
        [this.#operatorFunctions["×"], this.#operatorFunctions["÷"]],
        [this.#operatorFunctions["+"], this.#operatorFunctions["-"]]
    ];

    Parse(input) {
        let output = [];
        let lastChar = "";

        for (let i = 0; i < input.length; i++) {
            if (i > 0) lastChar = input[i - 1];

            let number = "";
            if ((input[i] == "-") && (lastChar == "" || lastChar in this.#operatorFunctions)) {
                number = "-";
                i++;
            }

            if (this.#isNumeric(input[i]) || input[i] == "√") {
                while ((input[i] != undefined) && (this.#isNumeric(input[i]) || (input[i] in this.#symbolFunctions))) {
                    number += input[i];
                    i++;
                }
                i--;

                if (((input[i] in this.#symbolFunctions) || (number[0] in this.#symbolFunctions))) {
                    number = this.#symbolFunctions[input[i]](number);
                }

                output.push(number);
                continue;
            }

            if ((input[i] in this.#operatorFunctions) &&!(lastChar in this.#operatorFunctions) && (lastChar != "")) {
                output.push(this.#operatorFunctions[input[i]]);
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

                let parsedInner = Parse(innerExpression);
//                let evaluatedInner = this.evaluateStatement(parsedInner);
                output.push({ function: this.#mathFunctions[functionName], parsed: parsedInner });
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
                output.push(() => this.Parse(parenthStatement));
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