class ButtonSection extends React.Component {
    #updateInput = null;
    #inverse = false;
    #inverseHandler = null;;
    #clearHandler = null;
    #evaluateHandler = null;

    constructor(props) {
        super(props);
        this.#updateInput = props.inputHandler;
        this.#inverse = props.inverse;
        this.#inverseHandler = props.inverseHandler;
        this.#clearHandler = props.clearHandler;
        this.#evaluateHandler = props.evaluateHandler;
    }

    render() {
        return (
            <div className="buttonContainer">
                    <div className="gridContainer" id="topButtonGridContainer">
                        <button onClick={() => this.#updateInput("Rad(")}>Rad</button>
                        <button onClick={() => this.#updateInput("Deg(")}>Deg</button>
                        <button onClick={() => this.#updateInput("!")}></button>
                        {["(", ")", "%"].map((x) => (
                            <button className="numberButton" key={x} onClick={() => this.#updateInput(x)}>
                                {x}
                            </button>
                        ))}
                        <button onClick={() => this.#clearHandler()}>
                            {this.state.input.length == 1 ? "AC" : "CE"}
                        </button>
                    </div>
                    <div className="gridContainer" id="leftButtonGridContainer">
                        <button onClick={() => this.#inverseHandler()}>Inv</button>
                        <button onClick={() => this.#updateInput("sin(")}>sin</button>
                        <button onClick={() => this.#updateInput("ln(")}>ln</button>

                        <button onClick={() => this.#updateInput("π")}>π</button>
                        <button onClick={() => this.#updateInput("cos(")}>cos</button>
                        <button onClick={() => this.#updateInput("log(")}>log</button>

                        <button>e</button>
                        <button onClick={() => this.#updateInput("tan(")}>tan</button>
                        <button onClick={() => this.#updateInput("√")}>√</button>

                        {
                            (this.state.inverse == false)
                                ? () => <button onClick={() => this.#updateInput("Ans")}>Ans</button>
                                : () => <button onClick={() => this.#updateInput("Rnd")}>Rnd</button>
                        }
                        <button onClick={() => this.#updateInput("e")}>EXP</button>
                        <button onClick={() => this.#updateInput("^")}>
                            X<sup>y</sup>
                        </button>
                    </div>
                    <div className="gridContainer" id="numberButtonGridContainer">
                        {[7, 8, 9, 4, 5, 6, 1, 2, 3, 0, "."].map((x) => (
                            <button className="numberButton" key={x} onClick={() => this.#updateInput(x)}>
                                {x}
                            </button>
                        ))}
                        <button onClick={() => this.#evaluateHandler()}>=</button>
                    </div>
                    <div className="gridContainer" id="rightButtonGridContainer">
                        <button onClick={() => this.#updateInput("÷")}>÷</button>
                        <button onClick={() => this.#updateInput("×")}>×</button>
                        <button onClick={() => this.#updateInput("-")}>-</button>
                        <button onClick={() => this.#updateInput("+")}>+</button>
                    </div>
            </div>
        );
    }
}