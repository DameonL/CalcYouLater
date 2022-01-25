class Calculator extends React.Component {
    #parser = null;
    #formatter = null;
    #evaluator = null;

    constructor(props) {
        super(props);
        this.state = {
            parsedInput: [],
            input: "0",
            history: [[0, 0]]
        };
        this.#parser = props.parser;
        this.#formatter = props.formatter;
        this.#evaluator = props.evaluator;
    }

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

    updateInput = (input) => {
        let formatted = this.#formatter.Format(this.state.input + input);
        document.getElementById("inputArea").innerText = formatted;

        this.setState({
            input: formatted
        });

        return true;
    };

    parseInput = () => {
        let parsed = this.#parser.Parse(input);
        return parsed;
    };

    evaluateInput = () => {
        let input = this.state.input;
        let openCount = this.countOccurences("(");
        let closedCount = this.countOccurences(")");
        while (openCount > closedCount) {
            input += ")";
            closedCount++;
        }

        let output = this.#evaluator.Evaluate(this.#parser.Parse(input));
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
                                text = text.replace("Ans", this.state.history[this.state.history.length - 1][1]);

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

                                let formatted = this.#formatter.Format(text);
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
