"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BlogLayoutProps {
  children: React.ReactNode;
  communityId?: number;
  showBackButton?: boolean;
  backButtonText?: string;
}

export default function BlogLayout({
  children,
  communityId,
  showBackButton = true,
  backButtonText = "Volver al feed de la comunidad"
}: BlogLayoutProps) {
  const router = useRouter();

  const handleBack = () => {
    if (communityId) {
      router.push(`/communities/community/${communityId}`);
    } else {
      router.back();
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-4">
      {showBackButton && (
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-primary hover:text-primary-hover transition-colors font-medium"
          >
            <ArrowLeft size={18} />
            {backButtonText}
          </button>
        </div>
      )}
      {children}
    </main>
  );
}