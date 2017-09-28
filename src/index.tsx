import * as React from 'react';
import * as ReactDOM from 'react-dom';
import KanbanBoardContainer from './components/KanbanBoardContainer';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(
  <KanbanBoardContainer />,
  document.getElementById('root')
);
registerServiceWorker();