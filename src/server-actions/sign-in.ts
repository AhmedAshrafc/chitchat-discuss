"use server";

import * as auth from "@/auth";

export async function signIn() {
  // Whenever we call 'signIn' we have to pass the provider name (GitHub, Google, Facebook, etc.);
  // We can have multiple OAuth providers inside of a single application.
  return auth.signIn("github");
}
