import * as React from 'react';
import * as update from 'immutability-helper';
import KanbanBoard from './KanbanBoard';
import { throttle } from './utils';
const API_URL: string = 'http://kanbanapi.pro-react.com';
const API_HEADERS = {
    'Content-Type': 'application/json',
    Authorization: 'pikachu'
};

class KanbanBoardContainer extends React.Component<{}, Custom.ContainerState> {
    constructor() {
        super();
        this.state = {
            cards: []
        };
        this.addTask = this.addTask.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.toggleTask = this.toggleTask.bind(this);
        this.persistCardDrag = this.persistCardDrag.bind(this);
        this.updateCardPosition = throttle(this.updateCardPosition.bind(this), 500, this);
        this.updateCardStatus = throttle(this.updateCardStatus.bind(this), 0, this);
    }
    componentDidMount() {
        fetch(API_URL + '/cards', {headers: API_HEADERS})
        .then((response) => response.json())
        .then((responseData) => {
            this.setState({cards: responseData});
        })
        .catch((error) => {
            throw error;
        });
    }
    addTask(cardId: number, taskName: string) {
        let cardIndex = this.state.cards.findIndex((card) => card.id === cardId);
        let newTask: Custom.Task = {id: Date.now(), name: taskName, done: false};
        let prevState = this.state;
        let nextState = update(this.state.cards, {
            [cardIndex]: {
                tasks: {$push: [newTask]}
            }
        });
        this.setState({cards: nextState});
        fetch(`${API_URL}/cards/${cardId}/tasks`, {
            method: 'post',
            headers: API_HEADERS,
            body: JSON.stringify(newTask)
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Server response was not OK');
            }
        })
        .then((responseData) => {
            newTask.id = responseData.id;
            this.setState({cards: nextState});
        })
        .catch((error) => {
            this.setState(prevState);
        });
    }
    deleteTask(cardId: number, taskId: number, taskIndex: number) {
        let cardIndex = this.state.cards.findIndex((card) => card.id === cardId);
        let prevState = this.state;
        let nextState = update(this.state.cards, {
            [cardIndex]: {
                tasks: {$splice: [[taskIndex, 1]]}
            }
        });
        this.setState({cards: nextState});
        fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
            method: 'delete',
            headers: API_HEADERS
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Server response was not OK');
            }
        })
        .catch((error) => {
            this.setState(prevState);
        });
    }
    toggleTask(cardId: number, taskId: number, taskIndex: number) {
        let cardIndex = this.state.cards.findIndex((card) => card.id === cardId);
        let newDoneValue;
        let prevState = this.state;
        let nextState = update(this.state.cards, {
            [cardIndex]: {
                tasks: {
                    [taskIndex]: {
                        done: {$apply: (done: boolean) => {
                            newDoneValue = !done;
                            return newDoneValue;
                        }}
                    }
                }
            }
        });
        this.setState({cards: nextState});
        fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
            method: 'put',
            headers: API_HEADERS,
            body: JSON.stringify({done: newDoneValue})
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Server response was not OK');
            }
        })
        .catch((error) => {
            this.setState(prevState);
        });
    }
    updateCardStatus(cardId: number, listId: string) {
        let cardIndex = this.state.cards.findIndex((c) => c.id === cardId);
        let card = this.state.cards[cardIndex];
        if (card.status !== listId) {
            this.setState(update(this.state, {
                cards: {
                    [cardIndex]: {
                        status: { $set: listId}
                    }
                }
            }));
        }
    }
    updateCardPosition(cardId: number, afterId: number) {
        if (cardId !== afterId) {
            let cardIndex = this.state.cards.findIndex((c) => c.id === cardId);
            let card = this.state.cards[cardIndex];
            let afterIndex = this.state.cards.findIndex((c) => c.id === afterId);
            this.setState(update(this.state, {
                cards: {
                    $splice: [
                        [cardIndex, 1],
                        [afterIndex, 0, card]
                    ]
                }
            }));
        }
    }
    persistCardDrag(cardId: number, status: string) {
        let cardIndex = this.state.cards.findIndex((c) => c.id === cardId);
        let card = this.state.cards[cardIndex];
        fetch(`${API_URL}/cards/${cardId}`, {
            method: 'put',
            headers: API_HEADERS,
            body: JSON.stringify({status: card.status, row_order_position: cardIndex})
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Server response was not OK');
            }
        })
        .catch((error) => {
            this.setState(update(this.state, {
                cards: {
                    [cardIndex]: {
                        status: {$set: status}
                    }
                }
            }));
        });
    }
    render() {
        return (
            <KanbanBoard 
                cards={this.state.cards} 
                taskCallbacks={{
                    add: this.addTask, 
                    toggle: this.toggleTask, 
                    delete: this.deleteTask
                }}
                cardCallbacks={{
                    updateStatus: this.updateCardStatus,
                    updatePosition: this.updateCardPosition,
                    persistCardDrag: this.persistCardDrag
                }}
            />
        );
    }
}
export default KanbanBoardContainer;