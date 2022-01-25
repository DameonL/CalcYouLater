class CalculatorDisplay extends React.Component {
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
}