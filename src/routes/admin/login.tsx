import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginRoute,
});

function AdminLoginRoute() {
  return null;
}
