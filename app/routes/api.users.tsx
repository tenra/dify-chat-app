import arc from "@architect/functions";
import { json } from "@remix-run/node";

interface User {
  pk: string;
  email: string;
  name: string;
  createdAt: string;
}

interface UserResponse {
  email: string;
  name: string;
  createdAt: string;
}

export async function loader() {
  const db = await arc.tables();
  
  try {
    // ユーザーテーブルから全ユーザーを取得
    const result = await db.user.scan();
    
    // パスワード情報は除外して返す
    const users: UserResponse[] = result.Items.map((user: User) => ({
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    }));

    return json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return json({ error: "Failed to fetch users" }, { status: 500 });
  }
} 
