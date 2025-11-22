import LateralMenu from "@/components/shared/LateralMenu";
import Navbar from "@/components/ui/navbar/Navbar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <div className="flex">
        <LateralMenu />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
