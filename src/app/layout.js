
import { Inter, Quicksand } from "next/font/google";
import "./globals.css";






const inter = Quicksand({ subsets: ["latin"] });

export const metadata = {
  title: "Better Dashboard",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">


   
      <body className={inter.className}>
        {children}
        </body>
    </html>
  );
}