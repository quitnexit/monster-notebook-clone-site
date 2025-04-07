import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  slug: string;
  images: {
    url: string;
    alt: string;
    isMain: boolean;
  }[];
  category: {
    name: string;
    slug: string;
    fullSlug: string;
  };
  specifications: {
    simple: {
      processor: string;
      graphics: string;
      memory: string;
      display: string;
      storage: string;
      os: string;
    };
  };
  stock: number;
}

interface ProductCardProps {
  product: Product;
  getImageUrl: (url: string | undefined) => string;
}

export default function ProductCard({ product, getImageUrl }: ProductCardProps) {
  return (
    <div className="flex flex-col h-full rounded-none overflow-hidden border border-[#323334] transition-all duration-300 hover:border-[#00ff00] hover:shadow-md hover:shadow-gray-800 bg-[#161617]">
      {/* Ürün Resmi */}
      <Link href={`/products/laptop/${product.category.fullSlug}/${product.slug}`}>
        <div className="relative h-48 overflow-hidden">
          <img 
            src={getImageUrl(product.images[0]?.url)} 
            alt={product.images[0]?.alt || product.name}
            className="w-full h-full object-contain p-3"
          />
        </div>
      </Link>

      {/* Ürün Bilgileri */}
      <div className="px-5 flex flex-col">
        <h3 className="text-lg font-semibold text-white mb-5 mt-5">
          {product.name}
        </h3>
        
        {/* Özellikler */}
        <ul className="list-disc pl-2">
          {Object.entries(product.specifications.simple).slice(0, 7).map(([key, value]) => (
            <li key={key} className="whitespace-nowrap overflow-hidden text-ellipsis list-inside text-[#A4A4A5] leading-normal text-xs">{value}</li>
          ))}
        </ul>

        {/* Fiyat Bilgisi ve Taksit Seçenekleri */}
        <div className="mt-auto pt-[30px] pb-[15px] flex flex-col justify-end">
          <p className="text-lg font-bold text-white">
            {product.price.toLocaleString()} TL
          </p>
          <p className="text-xs text-[#00ff00]">
            3500 TL x 12 ay'a varan Taksit Seçenekleri
          </p>
        </div>
      </div>

      {/* Sepete Ekle Butonu */}
      <div className="flex mb-2">
        <Link 
          href={`/products/laptop/${product.category.fullSlug}/${product.slug}`}
          className="w-full mx-5 my-5 py-3 px-10 text-white bg-[#161617] hover:bg-[#00ff00] hover:text-black border border-[#00ff00] transition-colors duration-300 flex items-center justify-center"
        >
          SEPETE EKLE
        </Link>
      </div>
    </div>
  );
}