"use client";

import { NextUIProvider } from "@nextui-org/react";
// This is required to be able to see if a user is signed in or not in a CLIENT COMPONENT!
import { SessionProvider } from "next-auth/react";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <NextUIProvider>{children}</NextUIProvider>
    </SessionProvider>
  );
}
