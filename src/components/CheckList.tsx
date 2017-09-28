import * as React from 'react';

class CheckList extends React.Component<Custom.CheckList> {
    constructor() {
        super();
        this.checkInputKeyPress = this.checkInputKeyPress.bind(this);
    }

    checkInputKeyPress(event: React.KeyboardEvent<HTMLInputElement> ) {
        if (event.key === 'Enter') {
            this.props.taskCallbacks.add(this.props.cardId, (event.target as HTMLInputElement).value);
            (event.target as HTMLInputElement).value = '';
        }
    }
    render() {
        let tasks = this.props.tasks.map((task, taskIndex) => (
            <li className="checklist__task" key={task.id}>
                <input 
                    type="checkbox" 
                    checked={task.done}
                    onChange={
                        this.props.taskCallbacks.toggle.bind(null, this.props.cardId, task.id, taskIndex)
                    }
                />
                {task.name}{' '}
                <a 
                    href="#" 
                    className="checklist__task--remove" 
                    onClick={this.props.taskCallbacks.delete.bind(null, this.props.cardId, task.id, taskIndex)}
                />
            </li>
        ));
        return(
            <div className="checklist">
                <ul>{tasks}</ul>
                <input 
                    type="text"
                    className="checklist--add-task"
                    placeholder="Type then hit Enter to add a task"
                    onKeyPress={this.checkInputKeyPress}
                />
            </div>
        );
    }
}

export default CheckList;