import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Providers } from "../provider/Provider";
import { ThemeProvider } from "@/components/theme-provider";


const inter = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "STARX",
  description: "Automate your assignments with STARX",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning> 
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >

            <Providers>
            {children}
      </Providers>

          </ThemeProvider>
        </body>
    </html>
  );
}
