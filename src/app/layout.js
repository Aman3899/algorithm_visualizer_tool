import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Visualizer Tool by Aman",
  description: "This is an Visualizer Tool for visualizing the most popular used algorithms for sorting and others. Made by Aman",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
