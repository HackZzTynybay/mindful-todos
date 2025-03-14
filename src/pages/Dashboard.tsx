
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTodos } from "@/context/TodoContext";
import { Button } from "@/components/ui/button";
import { LogOut, Plus, X } from "lucide-react";
import TodoItem from "@/components/TodoItem";
import AddTodoForm from "@/components/AddTodoForm";
import TodoFilters from "@/components/TodoFilters";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { todos, isLoading } = useTodos();
  const [isAddTodoOpen, setIsAddTodoOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTodos = todos.filter((todo) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !todo.completed) ||
      (statusFilter === "completed" && todo.completed);

    const matchesCategory =
      categoryFilter === "all" || todo.category === categoryFilter;

    const matchesSearch =
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesCategory && matchesSearch;
  });

  const completedTodos = todos.filter((todo) => todo.completed);
  const completionPercentage =
    todos.length > 0 ? (completedTodos.length / todos.length) * 100 : 0;

  // Group todos by category
  const todosByCategory: Record<string, typeof todos> = {};
  todos.forEach((todo) => {
    if (!todosByCategory[todo.category]) {
      todosByCategory[todo.category] = [];
    }
    todosByCategory[todo.category].push(todo);
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Mindful Todos</h1>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground hidden md:inline-block">
              Welcome, {user?.name}
            </span>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="col-span-1 lg:col-span-2">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold">Your Progress</h2>
                  <p className="text-muted-foreground">
                    {completedTodos.length} of {todos.length} tasks completed
                  </p>
                </div>
                <div className="mt-4 md:mt-0 w-full md:w-1/2">
                  <Progress value={completionPercentage} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">Quick Add</h2>
              <Dialog open={isAddTodoOpen} onOpenChange={setIsAddTodoOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" /> Add New Todo
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Todo</DialogTitle>
                  </DialogHeader>
                  <AddTodoForm onSuccess={() => setIsAddTodoOpen(false)} />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="by-category">By Category</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <TodoFilters
                  filter={statusFilter}
                  setFilter={setStatusFilter}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  categoryFilter={categoryFilter}
                  setCategoryFilter={setCategoryFilter}
                />

                <div className="divide-y">
                  {isLoading ? (
                    <div className="py-8 text-center">Loading todos...</div>
                  ) : filteredTodos.length > 0 ? (
                    filteredTodos.map((todo) => (
                      <TodoItem key={todo._id} todo={todo} />
                    ))
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      No todos found. 
                      {todos.length > 0 
                        ? " Try adjusting your filters."
                        : " Add your first todo to get started!"}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="by-category">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(todosByCategory).length > 0 ? (
                Object.entries(todosByCategory).map(([category, categoryTodos]) => (
                  <Card key={category} className="overflow-hidden">
                    <div className={`h-2 ${getCategoryColorClass(category)}`} />
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-semibold capitalize mb-4">
                        {category}
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                          ({categoryTodos.length})
                        </span>
                      </h3>
                      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                        {categoryTodos.map((todo) => (
                          <TodoItem key={todo._id} todo={todo} />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 py-8 text-center text-muted-foreground">
                  No todos found. Add your first todo to get started!
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

// Helper function for category colors
const getCategoryColorClass = (category: string) => {
  switch (category.toLowerCase()) {
    case "work":
      return "bg-todo-blue";
    case "personal":
      return "bg-todo-green";
    case "health":
      return "bg-todo-purple";
    case "education":
      return "bg-todo-pink";
    default:
      return "bg-gray-500";
  }
};

export default Dashboard;
