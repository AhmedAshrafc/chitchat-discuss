import Link from "next/link";

import { Chip } from "@nextui-org/react";

import { db } from "@/db";

import paths from "@/paths";

export default async function TopicList() {
  const topics = await db.topic.findMany();

  const renderedTopics = topics.map((topic) => (
    <div key={topic.id}>
      <Link href={paths.topicShowPath(topic.slug)}>
        <Chip color="warning" variant="shadow">
          {topic.slug}
        </Chip>
      </Link>
    </div>
  ));

  return <div className="flex flex-wrap gap-2">{renderedTopics}</div>;
}
