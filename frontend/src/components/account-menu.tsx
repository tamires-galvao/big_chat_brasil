import { useMutation } from "@tanstack/react-query";
import { ChevronDown, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getProfile, GetProfileResponse } from "@/api/get-profile";
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
import { useEffect, useState } from "react";

export function AccountMenu() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<GetProfileResponse | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    const documentId = localStorage.getItem("clientDocumentId");

    if (!documentId) {
      return;
    }

    const fetchProfile = async () => {
      try {
        const result = await getProfile(documentId);
        setProfile(result);
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  const { mutateAsync: signOutFn, isPending: isSigningOut } = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      navigate("/auth/sign-in", { replace: true });
      localStorage.removeItem("clientDocumentId");
    },
  });

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex select-none items-center gap-2"
          >
            <ChevronDown className="h-4 w-4" />
            {isLoadingProfile ? (
              <Skeleton className="h-4 w-24" />
            ) : (
              <span>{profile?.name}</span>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex flex-col space-y-0.5">
            {isLoadingProfile ? (
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            ) : (
              <>
                <span className="text-xs text-muted-foreground">
                  {profile?.documentType}:{" "}
                  {formatDocument(profile?.documentType, profile?.documentId)}
                </span>
                <span className="text-xs text-muted-foreground">
                  Plano:{" "}
                  {profile?.planType === "prepaid" ? "Pré-pago" : "Pós-pago"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {profile?.planType === "prepaid"
                    ? `Saldo: R$ ${profile?.balance?.toFixed(2) ?? "0,00"}`
                    : `Limite: R$ ${
                        profile?.creditLimit?.toFixed(2) ?? "0,00"
                      }`}
                </span>
              </>
            )}
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

function formatDocument(
  type: string | undefined,
  value: string | undefined
): string {
  if (!type || !value) return "";

  if (type === "CPF") {
    return value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  }

  if (type === "CNPJ") {
    return value.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5"
    );
  }

  return value;
}
