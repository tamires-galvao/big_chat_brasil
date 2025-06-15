import { MessageSquare } from "lucide-react";
import { Separator } from "./ui/separator";
import { ThemeToggle } from "./theme/theme-toggle";
import { AccountMenu } from "./account-menu";

export function Header() {
  return (
    <div className="border-b bg-background">
      <div className="flex h-14 items-center gap-4 px-4">
        <MessageSquare className="h-6 w-6 flex-shrink-0" />
        <span className="font-semibold text-lg">Chat</span>

        <Separator orientation="vertical" className="h-6" />

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <AccountMenu />
        </div>
      </div>
    </div>
  );
}
