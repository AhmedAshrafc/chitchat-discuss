"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/db";

import type { Topic } from "@prisma/client";

import { redirect } from "next/navigation";

import paths from "@/paths";

import { auth } from "@/auth";

import { z } from "zod";

const createTopicSchema = z.object({
  name: z
    .string()
    .min(3)
    .max(100)
    .regex(/[a-z-]/, {
      message: "Topic Name must be lowercase letters or dashes without spaces.",
    }),
  description: z.string().min(10).max(1000),
});

interface CreateTopicFormState {
  errors: {
    name?: string[];
    description?: string[];
    // To handle general form erros. For example, if the user is not logged in.
    _form?: string[];
  };
}

export async function createTopic(
  formState: CreateTopicFormState,
  formData: FormData
): Promise<CreateTopicFormState> {
  // await new Promise((resolve) => setTimeout(resolve, 2500));

  const result = createTopicSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const session = await auth();
  if (!session || !session.user) {
    return {
      errors: {
        _form: ["You must be logged in to create a topic."],
      },
    };
  }

  let topic: Topic;
  try {
    topic = await db.topic.create({
      data: {
        slug: result.data.name,
        description: result.data.description,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      };
    } else {
      return {
        errors: { _form: ["Something went wrong!"] },
      };
    }
  }

  // TODO: revalidate the homepage after creating a topic
  revalidatePath(paths.homePath());

  redirect(paths.topicShowPath(topic.slug));
}
