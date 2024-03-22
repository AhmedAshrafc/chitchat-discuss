"use client";

import { Input } from "@nextui-org/react";

import { useSearchParams } from "next/navigation";

import * as serverActions from "@/server-actions";

export default function SearchInput() {
  const searchParams = useSearchParams();

  return (
    <form action={serverActions.search}>
      <Input name="term" defaultValue={searchParams.get("term") || ""} />
    </form>
  );
}
