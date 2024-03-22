"use client";

import { useSession } from "next-auth/react";

export default function Profile() {
  const session = useSession();

  if (session.data?.user) {
    return (
      <div>{JSON.stringify(session.data.user)}</div>
      // <div>From Client Component: User is signed in!</div>
    );
  }

  return <div>From Client Component: User is NOT signed in!</div>;
}
