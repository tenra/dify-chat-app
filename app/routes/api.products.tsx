import arc from "@architect/functions";
import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";

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

interface CreateProductRequest {
  name: string;
  description: string;
}

export async function loader() {
  const db = await arc.tables();
  
  try {
    const result = await db.product.scan();

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

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const db = await arc.tables();
    const body = await request.json() as CreateProductRequest;

    if (!body.name || !body.description) {
      return json(
        { error: "Name and description are required" },
        { status: 400 }
      );
    }

    const product: Product = {
      pk: `product#${Date.now()}`,
      name: body.name,
      description: body.description,
      createdAt: new Date().toISOString(),
    };

    await db.product.put(product);

    return json({
      message: "Product created successfully",
      product: {
        name: product.name,
        description: product.description,
        createdAt: product.createdAt,
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return json({ error: "Failed to create product" }, { status: 500 });
  }
} 
