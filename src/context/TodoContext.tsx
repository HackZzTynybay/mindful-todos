
import React, { createContext, useState, useContext, useEffect } from "react";
import { todoService } from "../services/api";
import { useAuth } from "./AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface TodoContextType {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  createTodo: (title: string, description?: string, category?: string) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleComplete: (id: string, completed: boolean) => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTodos = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await todoService.getAllTodos();
      setTodos(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch todos.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch todos. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTodos();
    } else {
      setTodos([]);
    }
  }, [user]);

  const createTodo = async (title: string, description = "", category = "personal") => {
    setIsLoading(true);
    try {
      const response = await todoService.createTodo({ title, description, category });
      setTodos(prev => [...prev, response.data]);
      toast({
        title: "Todo created",
        description: "Your todo has been created successfully.",
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create todo.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create todo. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    setIsLoading(true);
    try {
      const response = await todoService.updateTodo(id, updates);
      setTodos(prev => prev.map(todo => todo._id === id ? response.data : todo));
      toast({
        title: "Todo updated",
        description: "Your todo has been updated successfully.",
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update todo.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update todo. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    setIsLoading(true);
    try {
      const response = await todoService.updateTodo(id, { completed });
      setTodos(prev => prev.map(todo => todo._id === id ? response.data : todo));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update todo status.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update todo status. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTodo = async (id: string) => {
    setIsLoading(true);
    try {
      await todoService.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo._id !== id));
      toast({
        title: "Todo deleted",
        description: "Your todo has been deleted successfully.",
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete todo.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete todo. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        isLoading,
        error,
        createTodo,
        updateTodo,
        deleteTodo,
        toggleComplete,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodos must be used within a TodoProvider");
  }
  return context;
};
