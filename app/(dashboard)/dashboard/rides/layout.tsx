import { OperationsRoute } from "@/features/ranch/components/operations-route";

export default function RidesLayout({ children }: { children: React.ReactNode }) {
  return <OperationsRoute>{children}</OperationsRoute>;
}
