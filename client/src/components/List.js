import React, { useState, useEffect, useRef } from 'react';
import ListItem from './ListItem';
import PlantIcon from '../assets/plant.png';
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';

export default function List() {
  const [tasks, setTasks] = useState([{ id: uuidv4(), text: 'Task 1', date: new Date().toDateString(), selected: false, checked: false, isEditing: false }]);

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/tasks');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const tasks = await response.json();
      setTasks(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Function to add a new task to tasks state
  const saveTask = async () => {
    try {
      const currentDate = new Date().toISOString();
      const response = await axios.post('http://localhost:5000/tasks', {
        id: uuidv4(),
        text: 'New Task',
        date: currentDate,
        selected: false,
        checked: false,
      });
  
      if (response.status === 201) {
        console.log('Task saved successfully:', response.data);
        const updatedTasks = [...tasks, response.data];
        updatedTasks.pop();

        setTasks(updatedTasks);
      } else {
        console.error('Failed to save task. Status:', response.status);
      }
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };
  
  


  const patchTask = async (id, updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Patched task data:', data);

      setTasks((prevTasks) => prevTasks.map((task) => (task.id === id ? data : task)));
    } catch (error) {
      console.error('Error patching task:', error);
      throw error;
    }
  };

  const removeTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const deleteTask = async (id) => {
 
    try {
      const response = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const dragItem = useRef();
  const dragOverItem = useRef();

  const handleTextChange = (taskId, e) => {
    const newText = e.target.value;
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, text: newText, date: new Date().toDateString() } : task
      )
    );
  };

  const handleCheckedState = (taskId) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === taskId ? { ...task, selected: !task.selected, checked: !task.checked } : task
      );

      const updatedTask = updatedTasks.find(task => taskId === task.id);
      console.log(updatedTask);

      return updatedTasks;
    });
  };

  const addTask = () => {

    const newTask = {
      id: uuidv4(),
      text: '',
      date: new Date().toDateString(),
      selected: false,
      checked: false,
      is_new: true,
      isEditing: true
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleAddTask = () => {
    const lastTask = tasks[tasks.length - 1];
    if (lastTask && lastTask.text.trim() === '') {
      console.error('Cannot add new task: the last task is empty.');
    } else {
      addTask();
    }
  };

  const handleSave = (task) => {
    if (task.text.trim()) {
      saveTask(task);
    }
  };

  const handlePatch = (task) => {
    if (!task.is_new) {
      const updatedData = {
        text: task.text,
        date: new Date().toDateString(),
        checked: task.checked,
        selected: task.selected,

      };
      patchTask(task.id, updatedData);
    }
  };

  const handleTaskSubmit = async (task) => {
    if (task.text.trim() === '') {
      console.error('Cannot save empty task');
      return;
    }
    if (task.is_new) {
      await saveTask(task);
    } else {
      await patchTask(task.id, { text: task.text });
    }
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === task.id ? { ...t, isEditing: false, is_new: false } : t
      )
    );
  };

  const dragStart = (e, position) => {
    dragItem.current = position;
  };

  const dragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  const dragOver = (e) => {
    e.preventDefault();
  };

  const drop = () => {
    const copyListItems = [...tasks];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setTasks(copyListItems);
  };

  return (
    <div className="w-1/2 mx-auto">
      <div className="flex justify-center mb-[-3.5rem] mt-[3.5rem]">
        <img src={PlantIcon} alt="plant1" className="mr-80 w-16" />
      </div>
      <h1 className="text-center text-4xl mt-[1rem]">To Do List</h1>
      <div className="flex justify-center mt-[-4rem]">
        <img src={PlantIcon} alt="alt2" className="ml-80 w-16" />
      </div>
      {tasks.map((task, index) => (
        <ListItem
          key={task.id}
          deleteTask={deleteTask}
          task={task}
          tasks={tasks}
          handlePatch={handlePatch}
          handleSave={handleSave}
          handleTextChange={handleTextChange}
          handleCheckedState={handleCheckedState}
          addTask={handleAddTask}
          removeTask={removeTask}
          saveTask={saveTask}
          patchTask={patchTask}
          handleTaskSubmit={handleTaskSubmit}
          draggable
          onDragStart={(e) => dragStart(e, index)}
          onDragEnter={(e) => dragEnter(e, index)}
          onDragOver={dragOver}
          onDragEnd={drop}
          isDraggedOver={dragOverItem.current === index}
        />
      ))}
      {tasks.length === 0 && (
        <div className="flex justify-center mt-4">
          <button onClick={handleAddTask} className="bg-green-500 text-white px-4 py-2 rounded">
            Add Task
          </button>
        </div>
      )}
    </div>
  );
}
