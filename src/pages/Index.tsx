
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-12">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-2xl font-bold text-primary">Mindful Todos</h1>
          <div className="space-x-4">
            {user ? (
              <Button asChild>
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </header>

        <main className="py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Stay organized with mindfulness
            </h2>
            <p className="text-xl mb-8 text-muted-foreground">
              A simple, beautiful todo app designed to help you focus on what matters most.
            </p>
            {!user && (
              <Button size="lg" asChild>
                <Link to="/register">Get Started — It's Free</Link>
              </Button>
            )}
          </div>

          <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Simple Organization</h3>
              <p className="text-muted-foreground">
                Easily create, categorize, and manage your tasks. Designed to reduce
                mental clutter.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-secondary-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Focus on What Matters</h3>
              <p className="text-muted-foreground">
                Prioritize your tasks and accomplish more with a clean, distraction-free
                interface.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-accent-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Track Your Progress</h3>
              <p className="text-muted-foreground">
                Visualize your accomplishments and stay motivated as you complete your
                tasks.
              </p>
            </div>
          </div>
        </main>

        <footer className="mt-12 pt-8 border-t text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Mindful Todos. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
