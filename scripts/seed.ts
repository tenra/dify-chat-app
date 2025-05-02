import arc from "@architect/functions";
import invariant from "tiny-invariant";

import { createProduct } from "~/models/product.server";
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

    // 商品データの作成
    const products = [
      { 
        name: "スマートオーダー", 
        description: "飲食店向けの次世代オーダーシステム。タブレットやスマートフォンから簡単に注文でき、注文履歴の管理や売上分析も可能。AIによるレコメンデーション機能で売上向上をサポート。従業員の負担を軽減し、顧客満足度の向上を実現します。" 
      },
      { 
        name: "スマートドライブ", 
        description: "運転支援システム。AIによる危険予測と運転支援で、より安全で快適なドライブを実現。車両の状態監視や燃費管理、ルート最適化など、運転に関する様々な機能を提供。運転者の疲労軽減と事故防止に貢献します。" 
      },
      { 
        name: "スマートアクセス", 
        description: "オフィスや施設の入退室管理システム。顔認証やICカードによるセキュアな認証を実現。入退室履歴の管理や、時間帯別のアクセス制御が可能。セキュリティ強化と効率的な施設管理を両立させます。" 
      },
    ];

    for (const product of products) {
      await createProduct(product.name, product.description);
      console.log(`Product created: ${product.name}`);
    }
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
