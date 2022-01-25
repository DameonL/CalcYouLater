export default class ButtonSection extends React.Component {
    inputHandler = null;
    buttons = null;

    constructor(props) {
        super(props);
        this.inputHandler = props.inputHandler;
        this.buttons = props.buttons;
    }

    render() {
        return (
            <div class="gridcontainer">{buttons}</div>
        );
    }
}