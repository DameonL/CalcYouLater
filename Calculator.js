class Calculator extends React.Component {
    #parser = null;

    constructor(props) {
        super(props);
        this.state = {
            parsedInput: [],
            input: "0",
            history: []
        };
        this.#parser = props.parser;
    }

    numberPrefixes = ["√"];
    numberSuffixes = ["%", "!"]

    isNumeric(x) {
        return (x >= "0" && x <= "9") || x == "." || x == "e";
    }

    mathFunctions = {
        "Rad": (number) => (number * (Math.PI / 180)),
        "Deg": (number) => (number * (180 / Math.PI)),
        "sin": Math.sin,
        "cos": Math.cos,
        "tan": Math.tan,
        "ln": Math.log,
        "log": Math.log10,
    }

    symbolFunctions = {
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

    // In order of operations
    operatorFunctions = {
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



    mathOperators = [
        [this.operatorFunctions["^"]],
        [this.operatorFunctions["×"], this.operatorFunctions["÷"]],
        [this.operatorFunctions["+"], this.operatorFunctions["-"]]
    ];

    getLastNumber = (input, startPosition) => {
        let lastNumber = "";
        for (let i = startPosition; i >= 0 && this.isNumeric(input[i]); i--) {
            lastNumber = input[i] + lastNumber;
        }
        return lastNumber;
    };

    countOccurences(char, input = this.state.input) {
        let count = 0;

        for (let i = 0; i < input.length; i++) {
            if (input[i] == char) {
                count++;
            }
        }

        return count;
    }

    allClear = () => {
        if (this.state.input.length > 1) {
            this.setState({
                input: this.state.input.substring(0, this.state.input.length - 1)
            });
        } else {
            this.setState({
                input: "0"
            });
        }
    };

    formatInput = (input) => {
        if (this.state.history.length > 0) {
            input = input.replace("Ans", this.state.history[this.state.history.length - 1][1]);
        } else {
            input = input.replace("Ans", "0");
        }

        let formatted = "";
        for (let i = 0; i < input.length; i++) {
            let lastChar = input[i - 1];
            let currentChar = input[i];
            let nextChar = input[i + 1];
            let currentNumber = this.getLastNumber(input, i);

            if (currentChar == "." && lastChar == ".") continue;

            if ((currentChar == ".") && !this.isNumeric(lastChar)) {
                formatted += "0" + currentChar;
                continue;
            }

            if (
                (!this.isNumeric(lastChar)) &&
                (currentChar == "0") &&
                (nextChar != ".")
            )
                continue;

            if (
                currentChar in this.operatorFunctions &&
                currentChar != "-" &&
                !this.isNumeric(lastChar) &&
                lastChar != "" &&
                lastChar != ")"
            )
                continue;

            if (currentChar == "*") currentChar = "×";
            else if (currentChar == "/") currentChar = "÷";

            if (currentChar == "e") {
                if (currentNumber.includes(".") && lastChar != ".")
                    continue

                if (lastChar != ".") formatted += ".";
            }


            if (lastChar == "√" && (!this.isNumeric(currentChar) && currentChar != "(")) continue;

            if (currentChar == "%" && (!this.isNumeric(lastChar) && currentChar != "(")) continue;

            if (currentChar == "(" && nextChar == ")") {
                i++;
                continue;
            }

            if (currentChar == "π" && this.isNumeric(nextChar)) {
                currentChar = "×" + currentChar;
            }

            if ((nextChar == "(" || nextChar == "π") && this.isNumeric(currentChar)) {
                currentChar = currentChar + "×";
            }

            if (
                lastChar == ")" &&
                (this.isNumeric(currentChar) || currentChar == "(")
            ) {
                currentChar = "×" + currentChar;
            }

            formatted += currentChar;
        }

        return formatted;
    };

    updateInput = (input) => {
        let formatted = this.formatInput(this.state.input + input);
        document.getElementById("inputArea").innerText = formatted;

        this.setState({
            input: formatted
        });

        return true;
    };

    parseInput = () => {
        let parsed = this.parseMathStatement(input);
        return parsed;
    };

    parseMathStatement = (input) => {
        let output = [];
        let lastChar = "";

        for (let i = 0; i < input.length; i++) {
            if (i > 0) lastChar = input[i - 1];

            let number = "";
            if (
                input[i] == "-" &&
                (lastChar == "" || lastChar in this.operatorFunctions)
            ) {
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

            if (
                input[i] in this.operatorFunctions &&
                !(lastChar in this.operatorFunctions) &&
                lastChar != ""
            ) {
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

    evaluateInput = () => {
        let input = this.state.input;
        let openCount = this.countOccurences("(");
        let closedCount = this.countOccurences(")");
        while (openCount > closedCount) {
            input += ")";
            closedCount++;
        }

        let output = this.evaluateStatement(this.parseMathStatement(input));
        output = output.toString();
        this.setState({
            history: [...this.state.history, [input, output]],
            input: output,
        });
        document.getElementById("inputArea").innerText = output;
        setTimeout(() => {
            let history = document.getElementById("history");
            history.scrollTop = history.scrollHeight;
        }, 1);

        return output;
    };

    evaluateStatement = (statement) => {
        // First we need to process parentheses recursively
        for (let i = 0; i < statement.length; i++) {
            if (Array.isArray(statement[i])) {
                statement[i] = this.evaluateStatement(statement[i]);
            }
        }

        // Get all the operator indices
        let operators = [];
        for (let i = 0; i < statement.length; i++) {
            if (statement[i] instanceof Function) {
                operators.push({
                    index: i,
                    operation: statement[i]
                });
            }
        }

        operators.sort((a, b) => {
            let getPriority = (item) => {
                for (let i = 0; i < this.mathOperators.length; i++) {
                    if (this.mathOperators[i].includes(item.operation)) {
                        return i;
                    }
                }
            };

            let aPriority = getPriority(a);
            let bPriority = getPriority(b);
            if (aPriority < bPriority) {
                return -1;
            } else if (aPriority > bPriority) {
                return 1;
            } else if (aPriority == bPriority) {
                return a.index < b.index ? -1 : 1;
            }
        });

        let output = 0;
        for (let i = 0; i < operators.length; i++) {
            let index = statement.indexOf(operators[i].operation);
            let leftStart = index - 1;
            let left = statement[leftStart];
            let rightStart = index + 1;
            let right = statement[rightStart];
            output = operators[i].operation(left, right);
            statement.splice(leftStart, 3, output);
        }

        return statement;
    };

    render() {
        let openCount = this.countOccurences("(");
        let closedCount = this.countOccurences(")");

        return (
            <div>
                <div className="gridContainer" id="calcGridContainer">
                    <div id="history">
                        {this.state.history.map((x) => (
                            <div key={x[0]}>
                                {x[0]} = {x[1]}
                            </div>
                        ))}
                    </div>
                    <div
                        id="inputWindow"
                        onClick={() => document.getElementById("inputArea").focus()}
                    >
                        <span type="text"
                            id="inputArea"
                            contentEditable="true"
                            suppressContentEditableWarning="true"
                            onKeyUp={(e) => {
                                e.preventDefault();
                                var sel = window.getSelection();
                                var range = sel.getRangeAt(0);
                                let selStart = range.startOffset;
                                let selEnd = range.endOffset;
                                e.target.innerHTML = e.target.innerHTML.replace("<br>", "");
                                let text = e.target.innerText;
                                if (text === undefined) {
                                    text = "";
                                }

                                if (e.key === "Enter") {
                                    this.setState({
                                        input: text,
                                    });

                                    e.target.innerText = this.evaluateInput();
                                    range.setStart(e.target.firstChild, e.target.innerText.length);
                                    return;
                                } else if (e.key === "Backspace" || e.key === "Delete") {
                                    if (text.length == 0) {
                                        this.setState({ input: "0" });
                                        e.target.innerText = "0";
                                        range.setStart(e.target.firstChild, e.target.innerText.length);
                                        return;
                                    }
                                }

                                let formatted = this.formatInput(text);
                                let difference = text.length - formatted.length;
                                this.setState({ input: formatted });
                                e.target.innerText = formatted;
                                if (selStart - difference > 0)
                                    range.setStart(e.target.firstChild, selStart - difference);
                            }}
                        >
                            0
                        </span>
                        <span style={{ color: "LightGrey" }}>
                            {openCount > closedCount ? ")" : ""}
                        </span>
                    </div>

                    <TopButtons
                        clearHandler={this.allClear}
                        inputHandler={this.updateInput}
                        currentInput={this.state.input}
                    />
                    <LeftButtons
                        inputHandler={this.updateInput}
                        currentInput={this.state.input}
                    />
                    <NumberButtons
                        inputHandler={this.updateInput}
                        equalsHandler={this.evaluateInput}
                        currentInput={this.state.input}
                    />
                    <RightButtons
                        inputHandler={this.updateInput}
                        currentInput={this.state.input}
                    />
                </div>
            </div>
        );
    }
}

class ButtonSection extends React.Component {
    constructor(props) {
        super(props);
    }

    inputHandler = (number) => () => {
        this.props.inputHandler(number);
    };
}

class TopButtons extends ButtonSection {
    render() {
        return (
            <div className="gridContainer" id="topButtonGridContainer">
                <button onClick={this.inputHandler("Rad(")}>Rad</button>
                <button onClick={this.inputHandler("Deg(")}>Deg</button>
                <button onClick={this.inputHandler("!")}>x!</button>
                {["(", ")", "%"].map((x) => (
                    <button className="numberButton" key={x} onClick={this.inputHandler(x)}>
                        {x}
                    </button>
                ))}
                <button onClick={this.props.clearHandler}>
                    {this.props.currentInput.length == 1 ? "AC" : "CE"}
                </button>
            </div>
        );
    }
}

class LeftButtons extends ButtonSection {
    render() {
        return (
            <div className="gridContainer" id="leftButtonGridContainer">
                <button>Inv</button>
                <button onClick={this.inputHandler("sin(")}>sin</button>
                <button onClick={this.inputHandler("ln(")}>ln</button>

                <button onClick={this.inputHandler("π")}>π</button>
                <button onClick={this.inputHandler("cos(")}>cos</button>
                <button onClick={this.inputHandler("log(")}>log</button>

                <button>e</button>
                <button onClick={this.inputHandler("tan(")}>tan</button>
                <button onClick={this.inputHandler("√")}>√</button>

                <button onClick={this.inputHandler("Ans")}>Ans</button>
                <button onClick={this.inputHandler("e")}>EXP</button>
                <button onClick={this.inputHandler("^")}>
                    X<sup>y</sup>
                </button>
            </div>
        );
    }
}

class NumberButtons extends ButtonSection {
    render() {
        return (
            <div className="gridContainer" id="numberButtonGridContainer">
                {[7, 8, 9, 4, 5, 6, 1, 2, 3, 0, "."].map((x) => (
                    <button className="numberButton" key={x} onClick={this.inputHandler(x)}>
                        {x}
                    </button>
                ))}
                <button onClick={this.props.equalsHandler}>=</button>
            </div>
        );
    }
}

class RightButtons extends ButtonSection {
    render() {
        return (
            <div className="gridContainer" id="rightButtonGridContainer">
                <button onClick={this.inputHandler("÷")}>÷</button>
                <button onClick={this.inputHandler("×")}>×</button>
                <button onClick={this.inputHandler("-")}>-</button>
                <button onClick={this.inputHandler("+")}>+</button>
            </div>
        );
    }
}
