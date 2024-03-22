"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/db";

import type { Post } from "@prisma/client";

import { redirect } from "next/navigation";

import paths from "@/paths";

import { auth } from "@/auth";

import { z } from "zod";

const createPostSchema = z.object({
  title: z.string().min(3).max(50),
  content: z.string().min(10).max(1000),
});

interface CreatePostFormState {
  errors: {
    title?: string[];
    content?: string[];
    // To handle general form erros. For example, if the user is not logged in.
    _form?: string[];
  };
}

export async function createPost(
  slug: string,
  formState: CreatePostFormState,
  formData: FormData
): Promise<CreatePostFormState> {
  const result = createPostSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const session = await auth();
  if (!session || !session.user) {
    return {
      errors: {
        _form: ["You must be logged in to create a post."],
      },
    };
  }

  const topic = await db.topic.findFirst({
    where: { slug: slug },
  });

  if (!topic) {
    return {
      errors: {
        _form: ["Cannot find topic"],
      },
    };
  }

  let post: Post;
  try {
    post = await db.post.create({
      data: {
        title: result.data.title,
        content: result.data.content,
        userId: session.user.id,
        topicId: topic.id,
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
      return { errors: { _form: ["Failed to create a post"] } };
    }
  }

  // TODO: revalidate the topic show page after creating a post
  revalidatePath(paths.topicShowPath(slug));

  redirect(paths.postShowPath(slug, post.id));
}
