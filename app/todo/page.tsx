"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SquarePen, Trash2 } from 'lucide-react';
import { url } from '../url';
import { useRouter } from 'next/navigation';
import { PuffLoader } from 'react-spinners';


interface Todo {
    _id: string;
    title: string;
    description: string;
    completed: boolean;
}
interface edit {
    _id: string;
    flag: boolean;
}

export default function Home() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [editMode, setEditMode] = useState<edit>({ _id: '', flag: false });
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    // console.log(count);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let user = localStorage.getItem('user') as string;
        const token = localStorage.getItem('token');
        user = user.slice(1, -1);
        setLoading(true);
        try {
            if (editMode.flag) {
                await fetch(`${url}/api/todos/${editMode._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ title, description, completed: false })
                });
                // console.log(res);
                const temp = [] as Todo[];
                const response = await fetch(`${url}/api/todos`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'user': user
                    }
                });

                const data = await response.json();
                // console.log(data);

                data?.todos.forEach((todo: Todo) => {
                    temp.push(todo);
                });
                setTodos(temp);
                setTitle('');
                setDescription('');
                setEditMode({ _id: '', flag: false });
            }
            else {
                const res = await fetch(`${url}/api/todos`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ title, description, user })
                });
                const newTodo = await res.json();
                if (newTodo.status === false) {
                    return;
                }
                setTodos([...todos, newTodo.savedTodo] as Todo[]);
                setTitle('');
                setDescription('');
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (_id: string) => {
        const token = localStorage.getItem('token');
        // console.log(todos);
        setLoading(true);

        try {
            const todo = todos.find(todo => todo._id === _id);
            if (!todo) return;

            await fetch(`${url}/api/todos/${_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: todo.title,
                    description: todo.description,
                    completed: !todo.completed
                })
            });

            setTodos((prevTodos) =>
                prevTodos.map((todo) =>
                    todo._id === _id ? { ...todo, completed: !todo.completed } : todo
                )
            );
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (_id: string) => {
        // console.log('deleting todo');
        const token = localStorage.getItem('token');
        // console.log(_id);
        // console.log(`${url}/api/todos/${_id}`);
        setLoading(true);

        try {
            await fetch(`${url}/api/todos/${_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            setTodos((prevTodos) => prevTodos.filter(todo => todo._id !== _id));

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (_id: string) => {
        const todo = todos.find(todo => todo._id === _id);
        setEditMode({ _id, flag: true });
        if (!todo) return;
        setTitle(todo.title);
        setDescription(todo.description);
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            let user = localStorage.getItem('user') as string;
            const token = localStorage.getItem('token');
            user = user?.slice(1, -1);
            // console.log("-->",user,token);

            if (!user || !token) {
                router.push('/');
            }

            setLoading(true);
            const temp = [] as Todo[];
            async function fetchData() {
                try {
                    const res = await fetch(`${url}/api/todos`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                            'user': user
                        }
                    });
                    const data = await res.json();
                    data?.todos.forEach((todo: Todo) => {
                        temp.push(todo);
                    });
                    // console.log(temp);
                    setTodos(temp);

                } catch (error) {
                    console.log(error);
                }
            }
            fetchData();
            setLoading(false);
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-4xl mx-auto p-4">
                <div className='mb-8 flex justify-between'>
                    <h1 className="text-3xl font-bold text-gray-900">My Todo List</h1>
                    <div className='flex '>
                        <Link href={'/profile'} className='mr-5'>
                            <h2 className='text-2xl font-bold text-blue-800 cursor-pointer'>Profile</h2>
                        </Link>
                        <button onClick={() => {
                            localStorage.removeItem('user');
                            localStorage.removeItem('token');
                            localStorage.removeItem('name');
                            localStorage.removeItem('email');
                            router.push('/');
                        }}
                            className='text-white bg-red-500 rounded px-2'>Logout</button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-8">
                    <div className="mb-4">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Todo title"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={loading}
                    >
                        {loading ? "loading..." : editMode.flag ? 'Update Todo' : 'Add Todo'}
                    </button>
                    <button
                        onClick={() => {
                            setTitle('');
                            setDescription('');
                            setEditMode({ _id: '', flag: false });
                        }}
                        className="bg-red-500 hover:bg-red-700 text-white ml-6 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Reset
                    </button>
                </form>

                <div className='flex justify-center items-center'>
                    {
                        loading &&
                        <PuffLoader color="#000000" size={80} />

                    }
                    {
                        !loading &&
                        <div className="space-y-4 w-full">
                            {todos.sort((e) => {
                                return e.completed ? 1 : -1;
                            }).map((todo) => (
                                <div key={todo._id} className="flex items-center p-4 border-b border-gray-300 ">
                                    <input
                                        type="checkbox"
                                        checked={todo.completed}
                                        onChange={() => handleToggle(todo._id)}
                                        className="mr-4"
                                    />
                                    <div className="flex-1">
                                        <h3 className={`font-medium ${todo.completed ? 'line-through' : ''}`}>
                                            {todo.title}
                                        </h3>
                                        <p className="text-gray-600 max-h-32 overflow-scroll">{todo.description}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            handleEdit(todo._id);
                                        }}
                                        className="text-green-500 hover:text-green-700"
                                    >
                                        <SquarePen />
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleDelete(todo._id);
                                        }}
                                        className="ml-4 text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 />
                                    </button>
                                </div>
                            ))}
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}