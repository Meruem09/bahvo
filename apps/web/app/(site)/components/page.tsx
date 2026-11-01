import type { Metadata } from "next";
import { SubjectIndex } from "@/components/subject-pages";

export const metadata: Metadata = { title: "Components" };

export default function ComponentsPage() {
  return <SubjectIndex kind="components" />;
}
