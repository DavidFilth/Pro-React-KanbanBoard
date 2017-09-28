declare namespace Custom{
    export interface Card{
        id: number,
        title: string,
        description: string,
        status: string,
        tasks: Array<Task>
        color: string;
        taskCallbacks: TaskCallbacks;
        cardCallbacks: CardCallbacks;
        connectDragSource?: any;
        connectDropTarget?: any;
    }
    export interface cardState{
        showDetails: boolean;
    }
    export interface Board{
        cards: Card[];
        taskCallbacks: TaskCallbacks;
        cardCallbacks: CardCallbacks;
    }
    export interface List{
        cards: Card[],
        id: string;
        title: string
        taskCallbacks: TaskCallbacks;
        cardCallbacks: CardCallbacks;
        connectDropTarget?: any
    }
    export interface CheckList{
        cardId: number;
        tasks: Array<Task>;
        taskCallbacks: TaskCallbacks
    }
    export interface Task{
        id: number;
        name: string;
        done: boolean
    }
    export interface ContainerState{
        cards: Card[];
    }
    export interface TaskCallbacks{
        toggle(cardId: number, taskId: number, taskIndex: number) : void;
        delete(cardId: number, taskId: number, taskIndex: number) : void;
        add(cardId: number, taskName: string): void;
    }
    export interface CardCallbacks {
        updateStatus(cardId: number, listId: string): void;
        updatePosition(cardId: number, afterId: number): void;
        persistCardDrag(cardId: number, status: string): void;
    }
}