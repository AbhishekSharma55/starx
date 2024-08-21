import { DashboardNavigationMenu } from "@/components/dashboard/NavigationMenu";
import { Montserrat } from "next/font/google";
const inter = Montserrat({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="fixed z-40 w-full bg-white">
          <DashboardNavigationMenu />
          <hr className="black w-full" />
        </div>
        <div className="">{children}</div>
      </body>
    </html>
  );
}
