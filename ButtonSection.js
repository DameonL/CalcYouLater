class ButtonSection extends React.Component {
    #buttons = null;

    constructor(props) {
        super(props);
        this.#buttons = props.buttons;
    }

    render() {
        return (this.#buttons);
    }
}