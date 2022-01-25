class ButtonSection extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div class="gridcontainer">{this.props.buttons}</div>
        );
    }
}