import React, { useState } from 'react';
import CheckMark from '../assets/check-mark.svg';
import AddButton from '../assets/green-add-button.svg';
import MinusButton from '../assets/minus-button.png';

export default function ListItem({
  task,
  deleteTask,
  handleTextChange,
  handleCheckedState,
  addTask,
  removeTask,
  saveTask,
  patchTask,
  onDragStart,
  onDragEnter,
  onDragOver,
  onDragEnd,
  draggable,
  isDraggedOver
}) {
  const [isEditing, setIsEditing] = useState(!task || !task.text);

  const handleSave = () => {
    if (task && task.text && task.text.trim()) {
      saveTask(task)
        .then(() => setIsEditing(false))
        .catch(error => console.error('Error saving task:', error));
    }
  };

  const handlePatch = () => {
    if (task && task.text && task.text.trim()) {
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
    if (!task || !task.text) {
      removeTask(task.id);
    } else {
      deleteTask(task.id);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (task.is_new) {
        handleSave();
      } else {
        handlePatch();
      }
    }
  };

  const handleAddTask = () => {
    if (addTask) {
      addTask({ target: { id: task ? task.id : '' } });
    }
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
      <div className="flex-grow">
        {isEditing ? (
          <input
            type="text"
            className="task-input border border-gray-400 p-2 rounded-md w-full"
            value={task ? task.text : ''}
            onChange={(e) => handleTextChange(task.id, e)}
            onBlur={handleKeyDown}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <p
          className={`block text-lg leading-tight font-medium cursor-pointer ${task.checked ? 'line-through text-gray-400' : 'text-black'}`}
            onClick={() => setIsEditing(true)}
            
          >
            {task ? task.text : ''}
          </p>
        )}
        <p className="text-sm text-gray-500">{task ? task.date : ''}</p>
      </div>
      <div className="ml-4 flex-shrink-0">
        <button onClick={handleAddTask}>
          <img src={AddButton} alt="addButton" className="w-6 m-1 h-6 cursor-pointer" />
        </button>
        <button onClick={() => handleDelete(task ? task.id : '')}>
          <img src={MinusButton} alt="minusButton" className="w-6 m-1 h-6 cursor-pointer" />
        </button>
      </div>
    </div>
  );
}
