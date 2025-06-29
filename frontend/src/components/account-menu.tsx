import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronDown, LogOut, User, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getProfile } from "@/api/get-profile";
import { signOut } from "@/api/sign-out";

import { Button } from "./ui/button";
import { Dialog } from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";
import { formatDocument } from "@/utils/formatters";
import { getClientBalanceInfo } from "@/utils/client";
import { Client } from "@/types";

export function AccountMenu() {
  const navigate = useNavigate();
  const documentId = localStorage.getItem("clientDocumentId");

  const {
    data: profile,
    isLoading: isLoadingProfile,
    isFetching,
  } = useQuery<Client>({
    queryKey: ["client-profile", documentId],
    queryFn: () => getProfile(documentId!),
    enabled: !!documentId,
  });

  const { mutateAsync: signOutFn, isPending: isSigningOut } = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      navigate("/auth/sign-in", { replace: true });
      localStorage.removeItem("clientDocumentId");
    },
  });

  const balanceInfo = profile ? getClientBalanceInfo(profile) : null;

  return (
    <Dialog>
      <Button variant="outline" className="flex select-none items-center gap-2">
        <Wallet className="h-4 w-4 flex-shrink-0" />
        <div className="text-right">
          {isLoadingProfile || isFetching ? (
            <Skeleton className="h-4 w-20" />
          ) : balanceInfo ? (
            <p className={`text-sm font-semibold ${balanceInfo.color}`}>
              {balanceInfo.label}: {balanceInfo.value}
            </p>
          ) : (
            <p className="text-sm font-semibold">Carregando...</p>
          )}
        </div>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex select-none items-center gap-2"
          >
            <ChevronDown className="h-4 w-4" />
            <User className="h-4 w-4 flex-shrink-0" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex flex-col space-y-0.5">
            <span className="text-xs text-muted-foreground">
              {profile?.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {profile?.documentType}:{" "}
              {formatDocument(profile?.documentType, profile?.documentId)}
            </span>
            <span className="text-xs text-muted-foreground">
              Plano: {profile?.planType === "prepaid" ? "Pré-pago" : "Pós-pago"}
            </span>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            asChild
            disabled={isSigningOut}
            className="text-rose-500 dark:text-rose-400"
          >
            <button className="w-full" onClick={() => signOutFn()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Dialog>
  );
}
