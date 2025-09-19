import './App.css'
import styles from './App.module.css'
import { useState, useEffect, useCallback } from 'react';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import TodosViewForm from './features/TodosViewForm';

function App() {
   
    const [todoList, setTodoList] = useState([]);
    
    
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    
  
    const [sortField, setSortField] = useState("createdTime");
    const [sortDirection, setSortDirection] = useState("desc");
    const [queryString, setQueryString] = useState("");

   
    const baseUrl = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
    const token = `Bearer ${import.meta.env.VITE_PAT}`;

   
    const encodeUrl = useCallback(() => {
        let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
        let searchQuery = "";
     
        if (queryString) {
            searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
        }
        
        return encodeURI(`${baseUrl}?${sortQuery}${searchQuery}`);
    }, [baseUrl, sortField, sortDirection, queryString]);

    
    useEffect(() => {
        // Add 500ms delay to prevent API calls on every keystroke
        const timeoutId = setTimeout(() => {
            const fetchTodos = async () => {
                
                setIsLoading(true);
                
              
                const url = encodeUrl(); 
                
                
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
        }, 500);

        // Cleanup function to clear timeout if dependencies change before timeout completes
        return () => clearTimeout(timeoutId);
    }, [encodeUrl, token]); // Updated dependencies - removed individual states since they're now handled by encodeUrl useCallback

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

        // Create options for fetch request
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

           
            const resp = await fetch(baseUrl, options);
            
            
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

    const updateTodo = async (editedTodo) => {
       
        const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
        
       
        const updatedTodos = todoList.map((todo) => {
            if (todo.id === editedTodo.id) {
                return { ...editedTodo };
            } else {
                return todo;
            }
        });
        setTodoList(updatedTodos);

       
        const payload = {
            records: [
                {
                    id: editedTodo.id,
                    fields: {
                        title: editedTodo.title,
                        isCompleted: editedTodo.isCompleted,
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

            const resp = await fetch(baseUrl, options);

            if (!resp.ok) {
                throw new Error(resp.message);
            }

        } catch (error) {
        
            console.log(error);
            setErrorMessage(`${error.message}. Reverting todo...`);
            
            const revertedTodos = todoList.map((todo) => {
                if (todo.id === editedTodo.id) {
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

            const resp = await fetch(baseUrl, options);
            
      
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

    return (
        <div className={styles.container}>
            <h1>Todo List</h1>
            <TodoForm onAddTodo={addTodo} isSaving={isSaving} /> 
            {/* Pass isLoading as a prop to TodoList */}
            <TodoList 
                todos={todoList} 
                isLoading={isLoading}
                onCompleteTodo={completeTodo} 
                onUpdateTodo={updateTodo} 
            />
            <hr />
            <TodosViewForm 
                sortDirection={sortDirection}
                setSortDirection={setSortDirection}
                sortField={sortField}
                setSortField={setSortField}
                queryString={queryString}
                setQueryString={setQueryString}
            />
            {/* Display error message if there is one */}
            {errorMessage && (
                <div className={styles.errorMessage}>
                    <hr />
                    <p>{errorMessage}</p>
                    <button onClick={() => setErrorMessage("")}>Dismiss</button>
                </div>
            )}
        </div>
    );
}

export default App