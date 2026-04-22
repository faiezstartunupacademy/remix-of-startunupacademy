import { ReactNode } from "react";

interface ProtectedFormationProps {
  contentSlug: string;
  contentName: string;
  children: ReactNode;
}

// Access protection disabled — all formations are now open access.
const ProtectedFormation = ({ children }: ProtectedFormationProps) => {
  return <>{children}</>;
};

export default ProtectedFormation;
