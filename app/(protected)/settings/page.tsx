import { Suspense } from "react";
import SettingsContent from "./settings-content";
import LoadingSpinner from "@/components/loading-spinner";

export default function SettingsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SettingsContent />
    </Suspense>
  );
}
