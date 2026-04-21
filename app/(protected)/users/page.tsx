import { Suspense } from "react";
import UsersContent from "./users-content";
import LoadingSpinner from "@/components/loading-spinner";
export default function UsersPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <UsersContent />
    </Suspense>
  );
}
