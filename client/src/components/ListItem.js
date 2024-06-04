import React, { useState } from 'react';
import CheckMark from '../assets/check-mark.svg';
import AddButton from '../assets/green-add-button.svg';
import MinusButton from '../assets/minus-button.png';

export default function ListItem({
  task,
  deleteTask,
  handleTextChange,
  handleCheckedState,
  handleTaskSubmit,
  addTask,
  removeTask,
  handlePatch,
  handleSave,
  onDragStart,
  onDragEnter,
  onDragOver,
  onDragEnd,
  draggable,
  isDraggedOver
}) {

  const [isEditing, setIsEditing] = useState(!task || !task.text);


  

  const handleDelete = () => {
    if (task.is_new || task.id === undefined) {
      removeTask(task.id);
    } else {
      deleteTask(task.id);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === 'return') {
      e.preventDefault();
      if(isEditing) {
        if (task.is_new) {
          handleSave(task);
          if(task.id === undefined){
            removeTask()
          }
        } else {
          handlePatch(task);
        }
        setIsEditing(false);
      }
    }
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    handleTaskSubmit(task);
  };

  const handleAddTask = (e) => {
    if(addTask) {
      addTask({ target: { id: task ? task.id : '' } });
    }
  };

  const handleBlur = () => {
    if (isEditing) {
      if (task.is_new) {
        handleSave(task);
      } else {
        handlePatch(task);
      }
      
    }setIsEditing(false);
  };

  return (
    <div
      // className={`overflow-y-auto w-full sm:w-auto md:w-96 lg:w-2/4 xl:w-3/4 m-4 p-4 mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4 ${isDraggedOver ? 'style.dragged-over' : ''}`}
      className={`overflow-y-auto m-4 p-4 mx-auto w-full flex space-x-4 items-center shadow-lg rounded-xl ${isDraggedOver ? 'style.dragged-over' : ''}`}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      >
      <div className="flex-shrink-0">
        <button
          onClick={() => handleCheckedState(task.id)}
          className={`shrink-0 w-8 h-8 rounded-full border-2 ${task.selected ? 'bg-green-300' : 'bg-white'} flex items-center justify-center cursor-pointer`}
        >
          {task.selected && (
            <img
              src={CheckMark}
              className="absolute h-4 w-4"
              alt="Check Mark"
            />
          )}
        </button>
      </div>
      <div className="flex-grow overflow-y-auto">
        {isEditing ? (
          <input
            type="text"
            className="task-input border border-gray-400 p-2 rounded-md w-full"
            value={task ? task.text : ''}
            onChange={(e) => handleTextChange(task.id, e)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <p
          className={`block text-lg leading-tight font-medium cursor-pointer ${task.checked ? 'line-through text-gray-400' : 'text-black'}`}
            onClick={() => setIsEditing(true)}
            
          >
            {task.text ? task.text : 'New Task'}
          </p>
        )}
        <p className="text-sm text-gray-500">{task ? task.date : ''}</p>
      </div>
      <div className="ml-4 flex-shrink-0">
        <button onClick={()=>handleAddTask(task ? task.id : '')}>
          <img src={AddButton} alt="addButton" className="w-6 m-1 h-6 cursor-pointer" />
        </button>
        <button onClick={() => handleDelete(task ? task.id : '')}>
          <img src={MinusButton} alt="minusButton" className="w-6 m-1 h-6 cursor-pointer" />
        </button>
      </div>
    </div>
  );
}
