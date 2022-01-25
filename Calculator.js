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

    #countOccurences(char, input = this.state.input) {
        let count = 0;

        for (let i = 0; i < input.length; i++) {
            if (input[i] == char) {
                count++;
            }
        }

        return count;
    }

    #allClear = () => {
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

    #updateInput = (input) => {
        let formatted = this.#formatter.Format(this.state.input + input);
        document.getElementById("inputArea").innerText = formatted;

        this.setState({
            input: formatted
        });

        return true;
    };

    #evaluateInput = () => {
        let input = this.state.input;
        let openCount = this.#countOccurences("(");
        let closedCount = this.#countOccurences(")");
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

    #inputKeyUp(event) {
        event.preventDefault();
        var sel = window.getSelection();
        var range = sel.getRangeAt(0);
        let selStart = range.startOffset;
        let selEnd = range.endOffset;
        e.target.innerHTML = event.target.innerHTML.replace("<br>", "");
        let text = event.target.innerText;
        text = text.replace("Ans", this.state.history[this.state.history.length - 1][1]);

        if (text === undefined) {
            text = "";
        }

        if (event.key === "Enter") {
            this.setState({
                input: text,
            });

            event.target.innerText = this.#evaluateInput();
            range.setStart(event.target.firstChild, event.target.innerText.length);
            return;

        } else if (event.key === "Backspace" || event.key === "Delete") {
            if (text.length == 0) {
                this.setState({ input: "0" });
                event.target.innerText = "0";
                range.setStart(event.target.firstChild, event.target.innerText.length);
                return;
            }
        }

        let formatted = this.#formatter.Format(text);
        let difference = text.length - formatted.length;
        this.setState({ input: formatted });
        event.target.innerText = formatted;

        if (selStart - difference > 0)
            range.setStart(e.target.firstChild, selStart - difference);
    }

    render() {
        let openCount = this.#countOccurences("(");
        let closedCount = this.#countOccurences(")");

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
                    <div id="inputWindow" onClick={() => document.getElementById("inputArea").focus()}
                    >
                        <span type="text"
                            id="inputArea"
                            contentEditable="true"
                            suppressContentEditableWarning="true"
                            onKeyUp={(event) => this.#inputKeyUp(event)}
                        >
                            0
                        </span>
                        <span style={{ color: "LightGrey" }}>
                            {openCount > closedCount ? ")" : ""}
                        </span>
                    </div>

                    <ButtonSection buttons={
                        <div className="gridContainer" id="topButtonGridContainer">
                            <button onClick={() => this.#updateInput("Rad(")}>Rad</button>
                            <button onClick={() => this.#updateInput("Deg(")}>Deg</button>
                            <button onClick={() => this.#updateInput("!")}>x!</button>
                            {["(", ")", "%"].map((x) => (
                                <button className="numberButton" key={x} onClick={this.#updateInput(x)}>
                                    {x}
                                </button>
                            ))}
                            <button onClick={() => this.#allClear}>
                                {this.state.input.length == 1 ? "AC" : "CE"}
                            </button>
                        </div>
                    } />

                    <ButtonSection buttons={
                        <div className="gridContainer" id="leftButtonGridContainer">
                            <button>Inv</button>
                            <button onClick={() => this.#updateInput("sin(")}>sin</button>
                            <button onClick={() => this.#updateInput("ln(")}>ln</button>

                            <button onClick={() => this.#updateInput("π")}>π</button>
                            <button onClick={() => this.#updateInput("cos(")}>cos</button>
                            <button onClick={() => this.#updateInput("log(")}>log</button>

                            <button>e</button>
                            <button onClick={() => this.#updateInput("tan(")}>tan</button>
                            <button onClick={() => this.#updateInput("√")}>√</button>

                            <button onClick={() => this.#updateInput("Ans")}>Ans</button>
                            <button onClick={() => this.#updateInput("e")}>EXP</button>
                            <button onClick={() => this.#updateInput("^")}>
                                X<sup>y</sup>
                            </button>
                        </div>
                    } />

                    <ButtonSection buttons={
                        <div className="gridContainer" id="numberButtonGridContainer">
                            {[7, 8, 9, 4, 5, 6, 1, 2, 3, 0, "."].map((x) => (
                                <button className="numberButton" key={x} onClick={() => this.#updateInput(x)}>
                                    {x}
                                </button>
                            ))}
                            <button onClick={() => this.#evaluateInput()}>=</button>
                        </div>
                    } />

                    <ButtonSection buttons={
                        <div className="gridContainer" id="rightButtonGridContainer">
                            <button onClick={() => this.#updateInput("÷")}>÷</button>
                            <button onClick={() => this.#updateInput("×")}>×</button>
                            <button onClick={() => this.#updateInput("-")}>-</button>
                            <button onClick={() => this.#updateInput("+")}>+</button>
                        </div>
                    } />
                </div>
            </div>
        );
    }
}