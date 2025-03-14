
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash, Pencil, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTodos } from "@/context/TodoContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  category: string;
}

interface TodoItemProps {
  todo: Todo;
}

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case "work":
      return "bg-todo-blue text-white";
    case "personal":
      return "bg-todo-green text-white";
    case "health":
      return "bg-todo-purple text-white";
    case "education":
      return "bg-todo-pink text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const { updateTodo, deleteTodo, toggleComplete } = useTodos();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description);

  const handleSaveEdit = async () => {
    if (editTitle.trim()) {
      await updateTodo(todo._id, {
        title: editTitle,
        description: editDescription,
      });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setIsEditing(false);
  };

  const handleToggleComplete = async () => {
    await toggleComplete(todo._id, !todo.completed);
  };

  return (
    <div
      className={cn(
        "group p-4 border rounded-lg shadow-sm mb-3 transition-all duration-200 hover:shadow-md",
        todo.completed ? "bg-muted" : "bg-card"
      )}
    >
      {isEditing ? (
        <div className="space-y-3">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Todo title"
            className="font-medium"
          />
          <Textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Add description (optional)"
            className="resize-none h-20"
          />
          <div className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelEdit}
              className="flex items-center"
            >
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveEdit}
              className="flex items-center"
            >
              <Check className="h-4 w-4 mr-1" /> Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-start">
          <div className="flex items-center h-6 mr-3">
            <Checkbox
              checked={todo.completed}
              onCheckedChange={handleToggleComplete}
              className="mt-1"
            />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex justify-between">
              <div className="flex flex-wrap gap-2 items-center">
                <h3
                  className={cn(
                    "font-medium break-words",
                    todo.completed ? "line-through text-muted-foreground" : ""
                  )}
                >
                  {todo.title}
                </h3>
                <Badge className={getCategoryColor(todo.category)}>
                  {todo.category}
                </Badge>
              </div>
            </div>
            {todo.description && (
              <p
                className={cn(
                  "text-sm text-muted-foreground",
                  todo.completed ? "line-through" : ""
                )}
              >
                {todo.description}
              </p>
            )}
            <div className="flex space-x-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-7 px-2"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-destructive hover:text-destructive"
                  >
                    <Trash className="h-3.5 w-3.5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your todo.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteTodo(todo._id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
