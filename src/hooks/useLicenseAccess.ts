import { useState, useEffect } from "react";

export const useLicenseAccess = (contentSlug: string) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkAccess();
  }, [contentSlug]);

  const checkAccess = () => {
    try {
      const validatedLicenses = JSON.parse(localStorage.getItem("validated_licenses") || "{}");
      const license = validatedLicenses[contentSlug];
      
      if (license) {
        setHasAccess(true);
      } else {
        setHasAccess(false);
      }
    } catch {
      setHasAccess(false);
    }
    setIsChecking(false);
  };

  const grantAccess = () => {
    setHasAccess(true);
  };

  const revokeAccess = () => {
    try {
      const validatedLicenses = JSON.parse(localStorage.getItem("validated_licenses") || "{}");
      delete validatedLicenses[contentSlug];
      localStorage.setItem("validated_licenses", JSON.stringify(validatedLicenses));
      setHasAccess(false);
    } catch {
      // Ignore errors
    }
  };

  return { hasAccess, isChecking, grantAccess, revokeAccess };
};
