import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { signIn } from "@/api/sign-in";
import { useMutation } from "@tanstack/react-query";

const signInForm = z.object({
  documentId: z
    .string()
    .min(11, "CPF ou CNPJ incompleto")
    .max(14, "Máximo 14 dígitos"),
});

type SignInForm = z.infer<typeof signInForm>;

export function SignIn() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInForm),
  });

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: signIn,
  });

  async function handleSignIn(data: SignInForm) {
    try {
      const documentType = data.documentId.length === 11 ? "CPF" : "CNPJ";

      const response = await authenticate({
        documentId: data.documentId,
        documentType,
      });

      localStorage.setItem("token", response.token);
      toast.success("Login realizado com sucesso!");
      navigate("/conversations");
    } catch {
      toast.error("Erro ao autenticar. Verifique os dados.");
    }
  }

  return (
    <>
      <Helmet title="Login" />
      <div className="min-h-dvh flex flex-col items-center justify-center w-full max-w-[350px] px-4 py-8 mx-auto gap-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Acessar Chats</h1>
          <p className="text-sm text-muted-foreground">
            Conecte sua empresa aos clientes de forma rápida, prática e
            profissional!
          </p>
        </div>

        <form
          onSubmit={handleSubmit(handleSignIn)}
          className="w-full space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="documentId">Seu CPF ou CNPJ</Label>
            <Input
              id="documentId"
              placeholder="Digite seu documento"
              maxLength={14}
              {...register("documentId")}
            />
            {errors.documentId && (
              <p className="text-sm text-red-500">
                {errors.documentId.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            Acessar Chats
          </Button>
        </form>
      </div>
    </>
  );
}
