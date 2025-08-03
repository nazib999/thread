import type { Metadata } from "next";
import {
  ClerkProvider,
} from "@clerk/nextjs";
import "../globals.css";
import Topbar from "@/components/Topbar";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import Bottombar from "@/components/Bottombar";

export const metadata: Metadata = {
  title: "Thread - Clerk Authentication",
  description: "Thread application with Clerk authentication",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Topbar />
          <main className="flex flex-row">
            <LeftSidebar />
            <section className="main-container">
              <div className="w-full max-w-4xl">{children}</div>
            </section>
            <RightSidebar />
          </main>
          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  );
}