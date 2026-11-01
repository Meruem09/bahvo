import type { Metadata } from "next";
import { SubjectIndex } from "@/components/subject-pages";

export const metadata: Metadata = { title: "Illustrations" };

export default function IllustrationsPage() {
  return <SubjectIndex kind="illustrations" />;
}
