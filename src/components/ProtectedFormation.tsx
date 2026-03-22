import { ReactNode } from "react";
import { useLicenseAccess } from "@/hooks/useLicenseAccess";
import LicenseKeyModal from "@/components/LicenseKeyModal";

interface ProtectedFormationProps {
  contentSlug: string;
  contentName: string;
  children: ReactNode;
}

const ProtectedFormation = ({ contentSlug, contentName, children }: ProtectedFormationProps) => {
  const { hasAccess, isChecking, grantAccess } = useLicenseAccess(contentSlug);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <LicenseKeyModal
        contentSlug={contentSlug}
        contentName={contentName}
        onSuccess={grantAccess}
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedFormation;
