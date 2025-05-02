import arc from "@architect/functions";

interface Product {
  pk: string;
  name: string;
  description: string;
  createdAt: string;
}

export async function createProduct(name: string, description: string) {
  const db = await arc.tables();
  const product: Product = {
    pk: `product#${name}`,
    name,
    description,
    createdAt: new Date().toISOString(),
  };

  await db.product.put(product);
  return product;
}

export async function getProducts() {
  const db = await arc.tables();
  const result = await db.product.scan();
  return result.Items as Product[];
} 
