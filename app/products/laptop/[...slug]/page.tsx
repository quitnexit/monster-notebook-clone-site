'use client'
import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Navbar from '../../../../navbar/navbar';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

interface DetailedProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: {
    _id: string;
    name: string;
    slug: string;
    fullSlug: string;
  };
  images: {
    url: string;
    alt: string;
    isMain: boolean;
  }[];
  specifications: {
    simple: {
      processor: string;
      graphics: string;
      memory: string;
      display: string;
      storage: string;
      os: string;
    };
    detailed: {
      processor: {
        brand: string;
        generation: string;
        model: string;
        cores: string;
        threads: string;
        cache: string;
        baseFrequency: string;
        maxFrequency: string;
        tdp: string;
      };
      graphics: {
        brand: string;
        model: string;
        vram: string;
        memoryType: string;
        interface: string;
        tdp: string;
      };
      memory: {
        size: string;
        type: string;
        configuration: string;
        frequency: string;
      };
      display: {
        size: string;
        panelType: string;
        resolution: string;
        refreshRate: string;
        features: string[];
      };
      storage: {
        primary: {
          name: string;
          type: string;
          capacity: string;
        };
        additionalSlots: string;
      };
      design: {
        width: string;
        height: string;
        thickness: string;
        weight: string;
        color: string;
        material: string;
      };
      ports: {
        usb2: string;
        usb3: string;
        hdmi: string;
        ethernet: string;
        wifi: string;
        bluetooth: string;
        audio: string;
        batteryWattage: string;
      };
      keyboard: {
        type: string;
        backlight: string;
        numpad: string;
        features: string[];
      };
    };
  };
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

export default function ProductDetail() {
  const params = useParams() as { slug: string[] };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<DetailedProduct | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });

  const ZOOM = 2.85;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const slugArray = Array.isArray(params.slug) ? params.slug : [params.slug];
        const fullPath = slugArray.join('/');
        
        const response = await fetch(`http://localhost:5000/api/laptop/${fullPath}`);
        
        if (!response.ok) {
          throw new Error('Ürün yüklenirken bir hata oluştu');
        }

        const data = await response.json();
        console.log('Gelen ürün detayı:', data);
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
        console.error('Ürün yükleme hatası:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params?.slug) {
      fetchProduct();
    }
  }, [params]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product]);

  const nextImage = () => {
    setSelectedImage((prev) => 
      prev === product!.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImage((prev) => 
      prev === 0 ? product!.images.length - 1 : prev - 1
    );
  };

  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return "/placeholder.jpg";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `http://localhost:5000${imageUrl}`;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const elem = imgRef.current;
    if (!elem) return;

    const { left, top } = elem.getBoundingClientRect();
    
    // Mouse pozisyonunu hesapla
    const x = e.clientX - left;
    const y = e.clientY - top;

    setMousePos({ x, y });
  };

  return (
    <>
      <Navbar />
      <div className="container mt-32 mx-auto px-4 py-8">
        {loading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {product && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div 
                className="relative aspect-square rounded-lg overflow-hidden"
                style={{ cursor: 'crosshair', height: '600px' }}
                onMouseEnter={() => setShowMagnifier(true)}
                onMouseLeave={() => setShowMagnifier(false)}
                onMouseMove={handleMouseMove}
              >
                {/* Büyütülmüş arka plan resmi */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url('${getImageUrl(product.images[selectedImage]?.url)}')`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    transform: showMagnifier ? `scale(${ZOOM})` : 'scale(1)',
                    transformOrigin: `${mousePos.x}px ${mousePos.y}px`,
                    opacity: showMagnifier ? 1 : 0,
                    transition: 'opacity 0.1s ease-out',
                    pointerEvents: 'none',
                    zIndex: 20,
                    backgroundColor: 'white'
                  }}
                />

                {/* Normal boyuttaki resim */}
                <Image
                  ref={imgRef}
                  src={getImageUrl(product.images[selectedImage]?.url)}
                  alt={product.images[selectedImage]?.alt || product.name}
                  fill
                  className="object-contain"
                  style={{ zIndex: 10 }}
                  quality={100}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />

                {/* Ok İşaretleri */}
                <div className="absolute inset-0 flex items-center justify-between p-4 z-30 opacity-0 hover:opacity-100 transition-opacity">
                  <button 
                    onClick={prevImage}
                    className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <IoChevronBack size={24} />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <IoChevronForward size={24} />
                  </button>
                </div>
              </div>

              {/* Küçük Resimler */}
              <div className="grid grid-cols-6 gap-2">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className={`
                      aspect-square 
                      relative 
                      rounded-md 
                      overflow-hidden 
                      cursor-pointer 
                      border-2
                      bg-white
                      ${selectedImage === index ? 'border-blue-500' : 'border-transparent'}
                    `}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={getImageUrl(image.url)}
                      alt={image.alt || `${product.name} - Resim ${index + 1}`}
                      fill
                      className="object-contain p-1"
                      sizes="(max-width: 768px) 33vw, 100px"
                      quality={80}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Sağ taraf - Sadece ürün bilgileri */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-gray-600">{product.description}</p>
              
              <div className="text-2xl font-bold text-blue-600">
                {product.price.toLocaleString('tr-TR')} ₺
              </div>

              {/* Basit Özellikler */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Temel Özellikler</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">İşlemci</p>
                    <p className="font-medium">{product.specifications.simple.processor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ekran Kartı</p>
                    <p className="font-medium">{product.specifications.simple.graphics}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">RAM</p>
                    <p className="font-medium">{product.specifications.simple.memory}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Depolama</p>
                    <p className="font-medium">{product.specifications.simple.storage}</p>
                  </div>
                </div>
              </div>

              {/* Detaylı Özellikler */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Detaylı Özellikler</h2>
                
                {/* İşlemci */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">İşlemci</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Model:</span>
                      <span className="ml-2">{product.specifications.detailed.processor.model}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Çekirdek:</span>
                      <span className="ml-2">{product.specifications.detailed.processor.cores}</span>
                    </div>
                  </div>
                </div>

                {/* Ekran */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Ekran</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Boyut:</span>
                      <span className="ml-2">{product.specifications.detailed.display.size}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Çözünürlük:</span>
                      <span className="ml-2">{product.specifications.detailed.display.resolution}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}