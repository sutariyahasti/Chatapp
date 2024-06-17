import { Inter } from "next/font/google";
import "./globals.css";
import { EdgeStoreProvider } from "@/app/lib/edgestore"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Chatapp",
  description: "REache to your fav one",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <EdgeStoreProvider>{children} </EdgeStoreProvider></body>
    </html>
  );
}
