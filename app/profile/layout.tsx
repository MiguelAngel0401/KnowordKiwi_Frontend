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
      <div className="flex flex-col md:flex-row">
        <LateralMenu />
        <div className="flex-1 pb-20 md:pb-0">{children}</div>
      </div>
    </div>
  );
}
