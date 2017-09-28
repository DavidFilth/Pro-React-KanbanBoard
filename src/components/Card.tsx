import * as React from 'react';
import * as marked from 'marked';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { DragSource, DropTarget } from 'react-dnd';

import CheckList from './CheckList';
let titlePropType = (props: Custom.Card, propName: string, componentName: string) => {
    if (props[propName]) {
        let value =  props[propName];
        if (typeof value !== 'string' || value.length > 80) {
            return new Error(`${propName} in ${componentName} is longer than 80 characters`);
        }
    }
    return;
};
const cardDragSpec: __ReactDnd.DragSourceSpec<Custom.Card> = {
    beginDrag(props: Custom.Card ) {
        return {
            id: props.id,
            status: props.status
        };
    },
    endDrag(props: Custom.Card) {
        props.cardCallbacks.persistCardDrag(props.id, props.status);
    }
};
const cardDropSpec: __ReactDnd.DropTargetSpec<Custom.Card> = {
    hover(props: Custom.Card, monitor: __ReactDnd.DropTargetMonitor) {
        const draggedId = (monitor.getItem() as Custom.Card).id;
        props.cardCallbacks.updatePosition(draggedId, props.id);
    }
};
let collectDrag: __ReactDnd.DragSourceCollector = (connect, monitor) => {
    return {
        connectDragSource: connect.dragSource()
    };
};
let collectDrop: __ReactDnd.DropTargetCollector = (connect, monitor) => {
    return {
        connectDropTarget: connect.dropTarget()
    };
};
class Card extends React.Component<Custom.Card, Custom.cardState> {
    static propTypes = {
        title: titlePropType
    };
    constructor(props: Custom.Card) {
        super(props);
        this.state = {
            showDetails: false
        };
        this.toggleDetails = this.toggleDetails.bind(this);
    }
    toggleDetails() {
        this.setState({showDetails: !this.state.showDetails});
    }
    render() {
        const { connectDragSource, connectDropTarget } = this.props;
        let cardDetails;
        if (this.state.showDetails) {
            cardDetails = (
                <CSSTransition classNames="toggle" timeout={{enter: 250, exit: 250}} >
                    <div className="card__details">
                        <span dangerouslySetInnerHTML={{__html: marked(this.props.description)}}/>
                        <CheckList 
                            cardId={this.props.id} 
                            tasks={this.props.tasks} 
                            taskCallbacks={this.props.taskCallbacks}
                        />
                    </div>
                </CSSTransition>
            );
        }
        let sideColor: object = {
            position: 'absolute',
            zIndex: -1,
            top: 0,
            bottom: 0,
            left: 0,
            width: 7,
            backgroundColor: this.props.color
        };
        return connectDropTarget (connectDragSource(
            <div className="card">
                <div style={sideColor} />
                <div
                    className={this.state.showDetails ? 'card__title card__title--is-open' : 'card__title'}
                    onClick={this.toggleDetails}
                >
                    {this.props.title}
                </div>
                <TransitionGroup>
                    {cardDetails}
                </TransitionGroup>
            </div>
        ));
    }
}

const dragCard = DragSource('card', cardDragSpec, collectDrag)(Card as React.ComponentClass<Custom.Card>);
export default DropTarget('card', cardDropSpec, collectDrop)(dragCard);