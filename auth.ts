import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import type { User } from "@/app/lib/definitions";
import bcrypt from "bcrypt";
import sql from "@/app/lib/db";

/*
async function getUser(username: string): Promise<User | undefined> {
  try {
    const user = await sql
      .prepare<User[]>(`SELECT * from users where username=?`)
      .bind(username)
      .get();
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}
*/

async function getUser(username: string): Promise<User | undefined> {
  try {
    console.log("email=", username);
    const user = await sql.query<User[]>(
      `SELECT * from users where username='${username}'`
    );
    return user[0][0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log(credentials);
        const parsedCredentials = z
          .object({ username: z.string(), password: z.string().min(1) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { username, password } = parsedCredentials.data;
          const user = await getUser(username);
          //console.log("User>:", user);
          if (!user) return null;
          //console.log("pw: ", bcrypt.hashSync("!mbc6677", 10));
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        } else {
          console.log("Credentials did not parse");
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
