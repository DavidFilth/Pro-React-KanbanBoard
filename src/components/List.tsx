import * as React from 'react';
import { DropTarget } from 'react-dnd';
import Card from './Card';

const listTargetSpec: __ReactDnd.DropTargetSpec<Custom.List> = {
    hover(props: Custom.List, monitor: __ReactDnd.DropTargetMonitor) {
        const draggedId = (monitor.getItem() as Custom.Card).id;
        props.cardCallbacks.updateStatus(draggedId, props.id);
    }
};
let collect: __ReactDnd.DropTargetCollector = (connect, monitor) => {
    return {
        connectDropTarget: connect.dropTarget()
    };
};
class List extends React.Component<Custom.List> {
    render() {
        const { connectDropTarget } = this.props;
        let cards = this.props.cards.map((card) => {
            return (
            <Card 
                key={card.id}
                id={card.id}
                title={card.title}
                description={card.description}
                status={card.status}
                tasks={card.tasks}
                color={card.color}
                taskCallbacks={this.props.taskCallbacks}
                cardCallbacks={this.props.cardCallbacks}
            />
            );
        });
        return connectDropTarget(
            <div className="list">
                <h1>{this.props.title}</h1>
                {cards}
            </div>
        );
    }
}
export default DropTarget('card', listTargetSpec, collect)(List);