import { redirect } from "next/navigation";

/** `/admin` has no content of its own: send people somewhere useful. */
export default function AdminHome() {
  redirect("/admin/products");
}