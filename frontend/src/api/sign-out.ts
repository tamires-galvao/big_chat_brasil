import { api } from "@/lib/axios";

export async function signOut() {
  try {
    await api.post("/sign-out");
  } catch {
    // ignora erro se mock ou offline
  }

  localStorage.removeItem("token");
  localStorage.removeItem("client");
}
