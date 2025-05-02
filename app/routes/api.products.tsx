import arc from "@architect/functions";
import { json } from "@remix-run/node";

interface Product {
  pk: string;
  name: string;
  description: string;
  createdAt: string;
}

interface ProductResponse {
  name: string;
  description: string;
  createdAt: string;
}

export async function loader() {
  const db = await arc.tables();
  
  try {
    // 商品テーブルから全商品を取得
    const result = await db.product.scan();
    
    // 必要な情報のみを返す
    const products: ProductResponse[] = result.Items.map((product: Product) => ({
      name: product.name,
      description: product.description,
      createdAt: product.createdAt,
    }));

    return json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return json({ error: "Failed to fetch products" }, { status: 500 });
  }
} 
