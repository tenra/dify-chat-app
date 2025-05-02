import arc from "@architect/functions";
import { json } from "@remix-run/node";

interface Product {
  pk: string;
  name: string;
  description: string;
  createdAt: string;
}

interface RetrievalRecord {
  content: string;
  score: number;
  title: string;
  metadata?: {
    description: string;
    createdAt: string;
  };
}

export async function action({ request }: { request: Request }) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return json(
      { error_code: 1001, error_msg: "無効な認証ヘッダー形式です。Bearer <api-key> 形式が期待されます。" },
      { status: 401 }
    );
  }

  const db = await arc.tables();
  
  try {
    const result = await db.product.scan();

    const records: RetrievalRecord[] = result.Items.map((product: Product) => ({
      content: `${product.name}: ${product.description}`,
      score: 1.0,
      title: product.name,
      metadata: {
        description: product.description,
        createdAt: product.createdAt
      }
    }));

    return json({ records });
  } catch (error) {
    console.error("Error fetching products:", error);
    return json(
      { error_code: 500, error_msg: "内部サーバーエラーが発生しました。" },
      { status: 500 }
    );
  }
} 
