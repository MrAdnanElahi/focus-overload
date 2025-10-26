import { redirect } from "next/navigation";
export default function Page() {
  redirect("/run"); // ← was "/(tabs)/run"
}
