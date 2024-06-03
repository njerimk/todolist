import React, { useState, useEffect, useRef } from 'react';
import ListItem from './ListItem';
import styles from './List.css';
import PlantIcon from '../assets/plant.png';
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

  const saveTask = async (task) => {
    try {
      const response = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Saved task data:', data);

      // Create a deep copy of the tasks array and update it
      const updatedTasks = JSON.parse(JSON.stringify(tasks));
      updatedTasks.push(data); // Assuming the API returns the newly created task
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error saving task:', error);
      throw error;
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
      throw error; // Ensure the error is propagated to the caller for further handling
    }
  };
  

  const removeTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
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
        <img src={PlantIcon} className="mr-80 w-16" />
      </div>
      <h1 className="text-center text-4xl mt-[1rem]">To Do List</h1>
      <div className="flex justify-center mt-[-4rem]">
        <img src={PlantIcon} className="ml-80 w-16" />
      </div>
      {tasks.map((task, index) => (
        <ListItem
          key={task.id}
          deleteTask={deleteTask}
          task={task}
          tasks={tasks}
          handleTextChange={handleTextChange}
          handleCheckedState={handleCheckedState}
          addTask={addTask}
          removeTask={removeTask}
          saveTask={saveTask}
          patchTask={patchTask}
          draggable
          onDragStart={(e) => dragStart(e, index)}
          onDragEnter={(e) => dragEnter(e, index)}
          onDragOver={dragOver}
          onDragEnd={drop}
          isDraggedOver={dragOverItem.current === index}
        />
      ))}
    </div>
  );
}
