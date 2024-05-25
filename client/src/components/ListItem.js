import React, {useState} from 'react';
import CheckMark from '../assets/check-mark.svg';
import AddButton from '../assets/green-add-button.svg';
import MinusButton from '../assets/minus-button.png';
import style from './List.css';


export default function ListItem({
  task,
  deleteTask,
  handleTextChange,
  handleCheckedState,
  addTask,
  removeTask,
  saveTask,
  onDragStart,
  onDragEnter,
  onDragOver,
  onDragEnd,
  draggable,
  isDraggedOver,
  patchTask
}) {
  

const [isEditing, setIsEditing] = useState(false);

const handleSave = () => {
  if (task.text.trim()) {
    saveTask(task)
      .then(() => setIsEditing(false))
      .catch(error => console.error('Error saving task:', error));
  }
};

const handlePatch = () => {
  if (task.text.trim()) {
    const updatedData = {
      text: task.text,
      date: new Date().toDateString(),
      selected: task.selected,
      checked: task.checked,
    };
    patchTask(task.id, updatedData)
      .then(() => setIsEditing(false))
      .catch(error => console.error('Error patching task:', error));
  }
};
  const handleDelete = () => {
    if (task.is_new) {
      removeTask(task.id);
    } else {
      deleteTask(task.id);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (task.is_new) {
        handleSave();
      } else {
        handlePatch();
      }
    }
    setIsEditing(false)
  };

  return (
    <div
      className={`m-4 p-4 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4 ${isDraggedOver ? 'style.dragged-over' : ''}`}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="flex-shrink-0">
        <button
          onClick={() => handleCheckedState(task.id)}
          className="relative mt-5 h-7 w-7 p-1 border-4 grid-rows-1 inline-grid z-10"
        >
          {task.selected && (
            <img
              src={CheckMark}
              alt="CheckMark"
              className="absolute h-5 w-5 top-0 left-0 mt-0 ml-1"
            />
          )}
        </button>
      </div>
      <div className="text-xl font-medium text-black">
        {isEditing ? (
          <input
            className="mt-10 text-slate-500 p-2"
            value={task.text}
            onChange={e => handleTextChange(task.id, e)}
            onKeyDown={handleKeyDown}
            onBlur={handleKeyDown}
            autoFocus
          />
        ) : (
          <div className="w-60">
              <p
                className="mt-10 w-40 text-slate-500 p-2 cursor-pointer"
                onClick={() => setIsEditing(true)}
              >
                {task.text}
              </p>
          </div>
        )}
        <p style={{marginLeft:"10px",fontSize:"10px", color:"#c0c6ce"}}>{task.date}</p>
      </div>
      {isEditing ? (

      <div className={{width:"20%"}}>
        <button className="button-container" style={{width:"65%",display:"inline-block", margin:"20%"}} onClick={addTask}>
          <img src={AddButton} alt="Add" id={task.id} />
        </button>
        <button style={{width:"65%",display:"inline-block", margin:"20%"}} onClick={handleDelete}>
          <img src={MinusButton} alt="Minus" />
        </button>
      </div>) :
      (<div style={{width:"20%"}}>
        <button className="button-container" style={{width:"65%",display:"inline-block", margin:"20%"}} onClick={addTask}>
          <img src={AddButton} alt="Add" id={task.id} />
        </button>
        <button style={{width:"65%",display:"inline-block", margin:"20%"}} onClick={handleDelete}>
          <img src={MinusButton} alt="Minus" />
        </button>
      </div>)}
    </div>
  );
}
