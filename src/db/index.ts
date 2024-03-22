import { PrismaClient } from "@prisma/client";

// This 'db' thing is an object that has a ton of different functions tied to it and this will
// be the primary way in which we work with information inside of our database.
// So we will be importing that ALL OVER THE PLACE INSIDE OF OUR PROJECT
export const db = new PrismaClient();
