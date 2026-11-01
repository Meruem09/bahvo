import type { Metadata } from "next";
import { Suspense } from "react";
import { SubjectStyles } from "@/components/subject-pages";
import { getSubject, getSubjects } from "@/lib/registry";

export function generateStaticParams() {
  return getSubjects("illustrations").map((subject) => ({ subject: subject.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/illustrations/[subject]">): Promise<Metadata> {
  const subject = getSubject("illustrations", (await params).subject);
  return subject ? { title: subject.name, description: subject.description } : {};
}

export default function IllustrationSubjectPage({ params }: PageProps<"/illustrations/[subject]">) {
  return (
    <Suspense>
      <SubjectStyles
        kind="illustrations"
        params={params.then(({ subject }) => ({ slug: subject }))}
      />
    </Suspense>
  );
}
