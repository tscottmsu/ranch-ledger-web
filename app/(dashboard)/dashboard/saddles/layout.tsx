import { OperationsRoute } from "@/features/ranch/components/operations-route";

export default function SaddlesLayout({ children }: { children: React.ReactNode }) {
  return <OperationsRoute>{children}</OperationsRoute>;
}
