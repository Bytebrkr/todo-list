import './App.css'
import { useState, useEffect } from 'react';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';

function App() {
    
    const [todoList, setTodoList] = useState([]);
    
    
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);

 
    const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
    const token = `Bearer ${import.meta.env.VITE_PAT}`;

    
    useEffect(() => {
        const fetchTodos = async () => {
           
            setIsLoading(true);
            
           
            const options = {
                method: "GET",
                headers: {
                    "Authorization": token
                }
            };

            try {
               
                const resp = await fetch(url, options);
                
              
                if (!resp.ok) {
                    throw new Error(resp.message);
                }

                const response = await resp.json();
                
                
                const fetchedTodos = response.records.map((record) => {
                    const todo = {
                        id: record.id,
                        ...record.fields
                    };
                    
                   
                    if (!todo.isCompleted) {
                        todo.isCompleted = false;
                    }
                    
                    return todo;
                });

             
                setTodoList(fetchedTodos);

            } catch (error) {
      
                setErrorMessage(error.message);
            } finally {
             
                setIsLoading(false);
            }
        };

       
        fetchTodos();
    }, []); 

    const addTodo = async (newTodo) => {
        
        const payload = {
            records: [
                {
                    fields: {
                        title: newTodo.title,
                        isCompleted: newTodo.isCompleted,
                    },
                },
            ],
        };

       
        const options = {
            method: 'POST',
            headers: {
                Authorization: token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        };

        try {
            
            setIsSaving(true);

            
            const resp = await fetch(url, options);
            
        
            if (!resp.ok) {
                throw new Error(resp.message);
            }

            
            const { records } = await resp.json();

         
            const savedTodo = {
                id: records[0].id,
                ...records[0].fields
            };

           
            if (!records[0].fields.isCompleted) {
                savedTodo.isCompleted = false;
            }

          
            setTodoList([...todoList, savedTodo]);

        } catch (error) {
          
            console.log(error);
            setErrorMessage(error.message);
        } finally {
           
            setIsSaving(false);
        }
    };

    const completeTodo = async (id) => {
        const originalTodo = todoList.find((todo) => todo.id === id);
     
        const completedTodo = { ...originalTodo, isCompleted: true };
        
   
        const updatedTodos = todoList.map((todo) => {
            if (todo.id === id) {
                return completedTodo;
            }
            return todo;
        });
        setTodoList(updatedTodos);


        const payload = {
            records: [
                {
                    id: id,
                    fields: {
                        title: originalTodo.title,
                        isCompleted: true,
                    },
                },
            ],
        };

    
        const options = {
            method: 'PATCH',
            headers: {
                Authorization: token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        };

        try {
            
            setIsSaving(true);

          
            const resp = await fetch(url, options);
            
           
            if (!resp.ok) {
                throw new Error(resp.message);
            }

        } catch (error) {
       
            console.log(error);
            setErrorMessage(`${error.message}. Reverting todo...`);
          
            const revertedTodos = todoList.map((todo) => {
                if (todo.id === id) {
                    return originalTodo;
                } else {
                    return todo;
                }
            });
            setTodoList([...revertedTodos]);
            
        } finally {
          
            setIsSaving(false);
        }
    };

    const updateTodo = (editedTodo) => {
        const updatedTodos = todoList.map((todo) => {
            if (todo.id === editedTodo.id) {
                return { ...editedTodo };
            } else {
                return todo;
            }
        });
        setTodoList(updatedTodos);
    };

    return (
        <div>
            <h1>Todo List</h1>
            <TodoForm onAddTodo={addTodo} isSaving={isSaving} /> 
            {/* Pass isLoading as a prop to TodoList */}
            <TodoList 
                todos={todoList} 
                isLoading={isLoading}
                onCompleteTodo={completeTodo} 
                onUpdateTodo={updateTodo} 
            /> 
            {/* Display error message if there is one */}
            {errorMessage && (
                <div>
                    <hr />
                    <p>{errorMessage}</p>
                    <button onClick={() => setErrorMessage("")}>Dismiss</button>
                </div>
            )}
        </div>
    );
}

export default App