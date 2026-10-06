import type { Metadata } from "next";
import CounselorClient from "@/components/CounselorClient";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "開始諮詢 — 心嶼",
};

export default function CounselPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <CounselorClient />
      </main>
      <SiteFooter />
    </>
  );
}
