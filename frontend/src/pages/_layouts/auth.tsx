import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { MessagesSquare } from "lucide-react";

export function AuthLayout() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    function handleResize() {
      setIsDesktop(window.innerWidth >= 768);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isDesktop) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-[400px]">
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen grid-cols-2 antialiased">
      <div className="flex h-full flex-col justify-between border-r border-foreground/5 bg-muted p-10 text-muted-foreground">
        <div className="flex items-center gap-3 text-lg text-foreground">
          <MessagesSquare className="h-5 w-5" />
          <span className="font-semibold">bcb.chat</span>
        </div>

        <footer className="text-sm">
          Painel do parceiro &copy; bcb.chat - {new Date().getFullYear()}
        </footer>
      </div>

      <div className="relative flex flex-col items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
}
