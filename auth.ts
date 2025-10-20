import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import type { User } from "@/app/lib/definitions";
import bcrypt from "bcrypt";
//import postgres from "postgres";
import sql from "@/app/lib/db";

//const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });
//import mysql from "mysql2/promise";

console.log("mysql url>", process.env.MYSQL_URL!);

// const sql = await mysql.createConnection({
//   host: process.env.MYSQL_URL!,
//   user: process.env.MYSQL_USER!,
//   password: process.env.MYSQL_PASSWORD!,
//   database: process.env.MYSQL_DATABASE!,
// });

async function getUser(username: string): Promise<User | undefined> {
  try {
    console.log("email=", username);
    //     const invoices = await sql.query<InvoicesTable[]>(`
    const user = await sql.query<User[]>(
      `SELECT * from users where username='${username}'`
    );
    //const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
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
          if (!user) return null;
          const encrypted_pw = await bcrypt.hash("tim", 10);
          console.log("encrypted: ", encrypted_pw);
          //const passwordsMatch = await bcrypt.compare(password, user.password);
          const passwordsMatch = await bcrypt.compare(password, encrypted_pw);

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
