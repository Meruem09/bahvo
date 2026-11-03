import type { Metadata } from "next";
import { Suspense } from "react";
import { SubjectStyles } from "@/components/subject-pages";
import { getSubject, getSubjects } from "@/lib/registry";

export function generateStaticParams() {
  return getSubjects("components").map((subject) => ({ component: subject.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/components/[component]">): Promise<Metadata> {
  const subject = getSubject("components", (await params).component);
  return subject ? { title: subject.name, description: subject.description } : {};
}

export default function ComponentPage({ params }: PageProps<"/components/[component]">) {
  return (
    <Suspense>
      <SubjectStyles
        kind="components"
        params={params.then(({ component }) => ({ slug: component }))}
      />
    </Suspense>
  );
}
