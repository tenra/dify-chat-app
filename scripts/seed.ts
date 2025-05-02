import arc from "@architect/functions";
import invariant from "tiny-invariant";

import { createUser } from "~/models/user.server"; // 既存の `createUser` を利用

async function seed() {
  console.log("Seeding database...");

  const db = await arc.tables();

  invariant(db, "Database connection failed");

  const email = "a@a.a";
  const password = "pppppppp";//p × 8

  try {
    // すでに存在する場合は削除
    await db.user.delete({ pk: `email#${email}` });
    await db.password.delete({ pk: `email#${email}` });

    // ユーザー作成
    const user = await createUser(email, password);
    console.log(`User created: ${user.email}`);
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed()
  .then(() => {
    console.log("Seeding complete.");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
