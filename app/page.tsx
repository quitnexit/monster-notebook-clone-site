"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../navbar/navbar";
import CategoryFilter from "../components/filters/CategoryFilter";
import SpecificationFilter, { portSpecifications } from "../components/filters/SpecificationFilter";
import ProductCard from "../components/ProductCard";
import { FiGrid, FiList } from 'react-icons/fi';

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
      disksupport: string;
      keyboard: string;
      thickness: string;
      weight: string;
      promotion: string;
      material: string;
    };
    detailed: {
      processor: {
        processorArchitecture: string;
        processor: string;
      };
      graphics: {
        gpu: string;
      };
      memory: {
        ram: string;
      };
      display: {
        screen: string;
      };
      storage: {
        firstPort: string;
        secondPort: string;
      };
      design: {
        dimensions: string;
        weight: string;
        materialtype: string;
        adapter: string;
        battery: string;
      };
      ports: {
        usb2: string;
        usb3: string;
        usb3c: string;
        hdmi: string;
        portsupport: string;
        speakers: string;
        microphone: string;
      };
      hardwarespecs: {
        keyboard: string;
        camera: string;
        wireless: string;
        speakers: string;
        soundsystem: string;
        internalcardreader: string;
        gigaethernet: string;
      };
      others: {
        guarantee: string;
        notification: string;
      };
    };
  };
  stock: number;
  createdAt: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  fullSlug: string;
  parent?: string;
  subcategories?: Category[];
  productCount: number;
}

interface Banner {
  _id: string;
  imageUrl: string;
  alt: string;
  category: 'main' | 'sidebar' | 'footer';
  position: string;
  isActive: boolean;
}

// Banner kategorilerini tanımla
type BannerCategories = 'main' | 'category' | 'sidebar' | 'footer';

// Banner state interface'i
interface BannerState {
  main: Record<string, Banner>;
  category: Record<string, Banner>;
  sidebar: Record<string, Banner>;
  footer: Record<string, Banner>;
}

const sortOptions = [
  { label: "En Yeni Eklenenler", value: "newest" },
  { label: "En Eski Eklenenler", value: "oldest" },
  { label: "Fiyat (Düşükten Yükseğe)", value: "price_asc" },
  { label: "Fiyat (Yüksekten Düşüğe)", value: "price_desc" },
  { label: "İsim (A-Z)", value: "name_asc" },
  { label: "İsim (Z-A)", value: "name_desc" },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>("default");
  const [selectedCategory, setSelectedCategory] = useState<string>("laptoplar");
  
  // Pagination state'i ekle
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 12
  });
  
  // Filtreler için state
  const [filters, setFilters] = useState({
    processor: "",
    processorArchitecture: "",
    graphics: "",
    memory: "",
    storage: "",
    display: "",
    priceRange: { min: 0, max: Infinity },
    inStock: false,
    os: "",
    firstPort: "",
    secondPort: ""
  });

  const [categoryCounts, setCategoryCounts] = useState<Array<{
    _id: string;
    name: string;
    slug: string;
    fullSlug: string;
    filteredCount: number;
  }>>([]);

  // Banner state'ini güncelle
  const [banners, setBanners] = useState<BannerState>({
    main: {},
    category: {},
    sidebar: {},
    footer: {}
  });

  // State ekleyelim - dropdown'ın açık/kapalı durumu için
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  // Resim URL'i oluşturma
  const getImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl) return "/images/placeholder.jpg";
    if (imageUrl.startsWith("http")) return imageUrl;
    if (imageUrl.startsWith("/uploads")) return `http://localhost:5000${imageUrl}`;
    return imageUrl;
  };

  // Kategorileri getir
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories');
        if (!response.ok) throw new Error('Kategoriler yüklenirken bir hata oluştu');
        const data = await response.json();
        console.log('Gelen kategoriler:', data);
        setCategories(data);
      } catch (err) {
        console.error('Kategori yükleme hatası:', err);
      }
    };

    fetchCategories();
  }, []);

  // Ürünleri getir
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        // Query parametrelerini oluştur
        const queryParams = new URLSearchParams();
        console.log("gelen query: ", queryParams);
        
        // Mevcut filtreler
        if (filters.processor) queryParams.append('processor', filters.processor);
        if (filters.graphics) queryParams.append('graphics', filters.graphics);
        if (filters.memory) queryParams.append('memory', filters.memory);
        if (filters.storage) queryParams.append('storage', filters.storage);
        if (filters.display) queryParams.append('display', filters.display);
        if (filters.priceRange.min > 0) queryParams.append('minPrice', filters.priceRange.min.toString());
        if (filters.priceRange.max < Infinity) queryParams.append('maxPrice', filters.priceRange.max.toString());
        if (filters.inStock) queryParams.append('inStock', 'true');
        
        // İşlemci mimarisi filtresini ekle
        if (filters.processorArchitecture) {
          queryParams.append('processorArchitecture', filters.processorArchitecture);
        }

        if (filters.os) {
          queryParams.append('os', filters.os);
        }

        if (filters.firstPort) {
          queryParams.append('firstPort', filters.firstPort);
        }

        if (filters.secondPort) {
          queryParams.append('secondPort', filters.secondPort);
        }

        // Diğer parametreler
        if (sortBy) queryParams.append('sortBy', sortBy);
        queryParams.append('page', currentPage.toString());
        queryParams.append('limit', '12');

        console.log("Gönderilen filtreler:", queryParams.toString()); // Debug için

        // API isteği
        const response = await fetch(
          `http://localhost:5000/api/laptops/filter/${selectedCategory || 'laptoplar'}?${queryParams.toString()}`
        );

        if (!response.ok) {
          throw new Error('Ürünler getirilemedi');
        }

        const data = await response.json();
        setProducts(data.products);
        setFilteredProducts(data.products);
        setPagination(data.pagination);
        setCategoryCounts(data.categoryCounts);

      } catch (error) {
        console.error('Filtreleme hatası:', error);
        setError('Ürünler yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [filters, sortBy, selectedCategory, currentPage]);

  // Banner'ı kategori ve pozisyona göre getiren fonksiyon
  const fetchBannerByPosition = async (category: string, position: string) => {
    try {
      console.log('Banner isteği yapılıyor:', category, position);
      const response = await fetch(`http://localhost:5000/api/banners/position/${category}/${position}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Gelen banner verisi:', data);
        setBanners(prev => ({
          ...prev,
          [category]: {
            ...prev[category as keyof BannerState],
            [position]: data
          }
        }));
      }
    } catch (error) {
      console.error('Banner yükleme hatası:', error);
    }
  };

  // Tüm banner'ları tek seferde yükleyen fonksiyon
  const loadAllBanners = async () => {
    try {
      console.log('Tüm banner\'lar için istek yapılıyor');
      const response = await fetch('http://localhost:5000/api/banners');
      
      if (response.ok) {
        const data = await response.json();
        console.log('Gelen tüm banner verisi:', data);
        
        const formattedData = {
          main: {},
          category: {},
          sidebar: {},
          footer: {}
        };

        // Tip güvenliği için düzeltme
        Object.entries(data).forEach(([category, banners]) => {
          if (Array.isArray(banners)) {
            banners.forEach((banner: Banner) => {
              if (category in formattedData) {
                formattedData[category as keyof BannerState] = {
                  ...formattedData[category as keyof BannerState],
                  [banner.position]: banner
                };
              }
            });
          }
        });

        console.log('Düzenlenmiş banner verisi:', formattedData);
        setBanners(formattedData);
      }
    } catch (error) {
      console.error('Banner yükleme hatası:', error);
    }
  };

  // İlk yüklemede banner'ları getir
  useEffect(() => {
    loadAllBanners();
  }, []);

  // Belirli bir banner'a erişmek için yardımcı fonksiyon
  const getBanner = (category: keyof BannerState, position: string): Banner | undefined => {
    return banners[category]?.[position as keyof typeof banners[typeof category]];
  };

  // Kategori değiştiğinde
  const handleCategoryChange = (categoryFullSlug: string) => {
    setSelectedCategory(categoryFullSlug);
    // Diğer filtreleri sıfırla veya koru
    // Ürünleri yeniden filtrele
  };

  // Sayfa değiştirme fonksiyonu
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0); // Sayfa başına scroll
  };

  // Debug için banner state'ini izle
  useEffect(() => {
    console.log('Güncel banner state:', banners);
  }, [banners]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSortMenuOpen && !(event.target as Element).closest('.sort-dropdown')) {
        setIsSortMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSortMenuOpen]);

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <Navbar />
      <div className="container mt-32 mx-auto px-4 py-8">
        {/* Üst Başlık */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Laptop Modelleri</h1>
          <p className="mt-2">
            En yeni laptop modellerini keşfedin ve ihtiyacınıza uygun laptopu filtreleme seçenekleriyle kolayca bulun.
          </p>
        </div>

        {/* Yeni Banner Container */}
        <div className="w-screen relative left-[50%] ml-[-50vw]">
          <div className={`relative transition-all duration-300 ${isExpanded ? 'h-auto bg-[#1b1c1d]' : 'h-[300px]'}`}>
            {/* Arka plan banner'ı - Sadece expanded değilken göster */}
            {!isExpanded && (
              <div className="absolute inset-0 z-0">
                <img 
                  src={getImageUrl(getBanner('main', 'main-2')?.imageUrl)}
                  alt="Banner arka plan"
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay */}
                {/* <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div> */}
              </div>
            )}

            {/* İçerik */}
            <div className="container mx-auto relative z-10 px-32 py-8">
              <div className="text-white pl-12">
                <h1 className="text-[48px] font-bold mb-5">Tüm Laptoplar</h1>
                <div className={`relative transition-all duration-300 ${!isExpanded ? 'h-20 overflow-hidden' : ''}`}>
                  <div className="text-[16px] leading-relaxed max-w-[800px]">
                    Bilgi ve iletişim teknolojilerindeki gelişime bağlı olarak, teknoloji durumunda yaşanan hızlı değişim, laptop'lardaki donanım bileşenlerinin boyutlarının küçülerek daha hızlı ve daha geniş kapasiteli olmasını sağlıyor
                    {isExpanded && (
                      <>
                        <br /><br />
                        Bunun sonucunda kullanıcılar, gündelik yaşamlarında kullanmak veya iş hayatlarında yer vermek üzere, yeni nesil laptop modellerini tercih ediyor. Eğer siz de ilk defa bir laptop alacaksanız ya da var olan laptop’ınızı emekliye ayırıp yerine; üstün görüntüler sunan, hızlı ve geniş kapasiteli bir laptop almayı düşünüyorsanız, Monster Notebook’un kullanıcı ihtiyaçları doğrultusunda ürettiği modellerden birisini tercih edebilirsiniz.
                        <h2 className="text-[24px] font-bold text-white mt-12 mb-12">
                          Laptop'unuz Neden Yeni Nesil Donanımlara Sahip Olmalı?
                        </h2>
                        <p className="text-[16px] leading-relaxed mb-4">Bilgisayar kullanıcılarının hayatında uzun süredir var olan, bununla birlikte teknolojik gelişmeler sayesinde her geçen yıl teknik anlamda daha da güçlenip boyutları küçülen ve hafifleyen laptop modelleri, artık herkesin vazgeçilmezi konumunda.</p>
                        <ul className="list-disc pl-5 space-y-4">
                          <li><strong>Taşınabilirlik:</strong> Seyahatlerinde bile projeleri üzerinde rahatlıkla çalışabilme imkânı bulan profesyoneller, favori oyunlarıyla dilediği yerde eğlenceli vakit geçirmeyi seven oyun meraklıları, hiç tereddüt etmeden, gereksinimlerini karşılayabilen bir laptop modeli ediniyor. Mobilite konusunda epey iddialı olan ve ağırlıkları, tercih edeceğiniz cihaza bağlı olarak bir kilogram sınırının bile altında kalabilen yeni nesil donanımlı dizüstü bilgisayarların tek hüneri, üstün taşınabilirlik özellikleri değil.</li>
                          <li><strong>Yüksek Performans:</strong> Bilgisayarınızın çalıştırma düğmesine basmanızın ardından işletim sisteminin yüklenmesini dakikalarca bekliyorsanız, yeni çıkan oyunları akıcı oynamak şöyle dursun, slayt gösterisi gibi görüntülüyorsanız, şimdiki bilgisayarınızla vedalaşma vaktiniz gelmiş demektir. Intel ve NVIDIA gibi teknoloji dünyasına yön veren yenilikçi markaların geliştirdiği donanımlarla güçlendirilen laptop modelleri, saatler süren çalışmalarınızı hızla tamamlamanızı sağlar. Dijital içerik üretimi, oyun ve daha pek çok alanda değerlendirebileceğiniz dizüstü bilgisayarlar; yerleşik Wi-Fi, Bluetooth, yüksek kaliteli ekran, haricî bir klavyeyi aratmayan tuş takımı, geniş kapasiteli batarya gibi özellikleri de beraberinde getiriyor.</li>
                          <li><strong>Kullanım Kolaylığı:</strong> Tamamlanmış bir ürün olarak sunulan, donanım sürücülerinden önceden yüklü yazılımlarına kadar her yönüyle optimize edilmiş olan laptop modelleri, yeni nesil donanım içermesinin avantajlarını, kullanım kolaylığı tarafında da gösterir. Özellikle Windows 11 işletim sisteminin yeniliklerinden yararlanmak istiyorsanız, güncel yazılımlarınızı, donanım / donanım sürücü sorunlarıyla boğuşmadan kullanmayı arzu ediyorsanız, Windows 11 ile güçlendirilmiş Monster laptop modellerini avantajlı ödeme koşullarıyla satın alabilirsiniz.</li>
                        </ul>
                        <p className="text-[16px] pl-5 leading-relaxed mt-4">Özellikle Windows 11 işletim sisteminin yeniliklerinden yararlanmak istiyorsanız, güncel yazılımlarınızı, donanım / donanım sürücü sorunlarıyla boğuşmadan kullanmayı arzu ediyorsanız, Windows 11 ile güçlendirilmiş Monster laptop modellerini avantajlı ödeme koşullarıyla satın alabilirsiniz.</p>
                        <h2 className="text-[24px] font-bold text-white mt-12 mb-12">
                          Laptop Alırken Dikkat Etmeniz Gereken En Önemli 5 Nokta
                        </h2>
                        <p className="text-[16px] leading-relaxed mb-4">Emektar bilgisayarınızla vedalaşmaya hazırlanırken yeni laptop modelinizin seçiminde dikkat edeceğiniz özelliklere gelin birlikte bakalım.</p>
                        <ol className="list-decimal pl-5 space-y-4">
                          <li><strong>Fiziksel Özellikler:</strong> Almayı düşündüğünüz dizüstü bilgisayarın ekranının 14,1 inç mi, 15,6 inç mi yoksa 17,3 inç mi olacağı, hangi kullanım amacı doğrultusunda geliştirildiği gibi faktörler, laptop modelinizin fiziksel özelliklerini ve ağırlığını da belirler.</li>
                          <li><strong>Ekran:</strong> Genişlik, çözünürlük, renk doğruluğu gibi parametreleri göz önünde bulundurarak yeni bir dizüstü bilgisayara yatırım yapmanız yerinde olur. Ekranın görüntü kalitesi sizin için ön plandaysa IPS panelli modelleri tercih edebilirsiniz. Oyun süreçlerinde renk doğruluğunun yanında çözünürlük ve ekran yenileme değerlerini de önemsiyorsanız, Monster laptop modellerindeki ekranlar, beklentilerinizin ötesinde bir deneyim sunar.</li>
                          <li><strong>Dâhilî Donanım Özellikleri:</strong> Bilgisayarın gücünü belirleyen işlemci, oyunların akıcı çalışmasını sağlayan ekran kartı, sistemin takılmadan çalışmasını mümkün kılan RAM, verileri depolayan ve yüksek okuma/yazma hızlarına sahip olan SSD, almayı düşündüğünüz laptop modelinde dikkat etmeniz gereken özelliklerden bazılarıdır. Sunduğu laptoplarda en güncel teknolojik donanımlara yer veren Monster; iş, oyun ve eğlence odaklı serilerinde kullanıcılarını memnun etmek için tasarlamıştır.</li>
                          <li><strong>Bağlantı Seçenekleri:</strong> Sahip olmayı istediğiniz laptop’ta hangi tür fiziksel bağlantı olanaklarından kaçar adet bulunduğu, o bilgisayarı hangi ölçüde çok yönlü kullanabileceğinizi belirler. Bunun yanında güncel Wi-Fi 6 ve Bluetooth 5 teknolojileri de laptop alırken dikkat etmeniz gereken unsurlar arasındadır.</li>
                          <li><strong>Teknik Destek ve Garanti İmkânları:</strong> Karşınıza çıkan sayısız ürünün kimi zaman tasarımı kimi zamansa teknik özellikleri ilginizi çekiyor olabilir. Ancak laptop üreticisinin teknik desteği ve garanti olanakları, dikkat etmeniz gereken belki de en önemli durumlar arasında yer alır. Elektronik ürünlerin standart garanti prosedürlerine ek olarak kullanıcı hatalarına karşı tamamlayıcı garanti avantajı sunan Monster Notebook, ömür boyu ücretsiz bakım garantisi gibi imkânları da size sunar.</li>
                        </ol>
                        <h2 className="text-[36px] font-bold text-white mt-12 mb-12">
                          Sıkça Sorulan Sorular
                        </h2>
                        <h3 className="text-[19px] font-bold text-white">Laptop alırken nelere dikkat etmeliyim?</h3>
                        <p className="text-[16px] leading-relaxed mt-4">Kullanmayı düşündüğünüz dizüstü bilgisayarın fiziksel ve yazılımsal özelliklerine dikkat ederek sizin için en doğru ürünü seçebilirsiniz. Laptop’ın; ekran genişliği, işlemci, RAM ve SSD gibi dâhilî donanım bileşenleri, çalışma ve oyun süreçlerinizi etkiler.</p>
                        <p className="text-[16px] leading-relaxed mt-4">Ek olarak, satın almayı planladığınız laptop’ın, Windows 11 işletim sistemine sahip olması size,üretme, iş birliği yapma ve sahip olduklarınızı güvende tutma gücü verir.</p>
                        <br></br>
                        <h3 className="text-[19px] font-bold text-white mt-4">Oyun için hangi donanım özelliklerine sahip laptop modellerini tercih etmeliyim?</h3>
                        <p className="text-[16px] leading-relaxed mt-4">Etkileyici grafiklere sahip oyunları, bilgisayarlardaki ekran kartı, işlemci ve RAM gibi birimleri yoğun şekilde kullanır. Bu nedenle ekran kartı ve işlemcinin güçlü olduğu, doğrudan oyunculara yönelik üretilen <a href="https://www.monsternotebook.com.tr/oyun-bilgisayarlari" className="text-[#00ff00]">oyun bilgisayarlarını</a> tercih edebilirsiniz. Bu tür laptop modellerinin taşıdıkları güçlü donanım bileşenleri ve yüksek çözünürlüklü ekranları sayesinde oyunları 4K çözünürlükte dahi deneyimleyebilirsiniz.</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Alt kısım - Daha fazla göster butonu */}
                <div className="flex justify-end items-center mt-4 max-w-[800px]">
                  <button
                    onClick={() => {
                      setIsExpanded(!isExpanded);
                      if (isExpanded) {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="text-[#00ff00] hover:text-[#00cc00] text-sm flex items-center gap-2"
                  >
                    {isExpanded ? 'daha az göster' : 'daha fazla göster'}
                    <svg
                      className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
              {/* Windows logosu */}
              <div className={`w-full flex justify-end transition-all duration-300 ${isExpanded ? 'mt-24' : 'mt-4'}`}>
                <img src="https://storage-monsternotebook-tr.mncdn.com/monsternotebook-tr/UPLOAD/windows11/win11_.svg" alt="Windows 11" className="h-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Üst Bar - Sıralama ve Görünüm */}
        <div className="w-screen relative left-[50%] ml-[-50vw] bg-[#000000] mb-6">
          <div className="container mx-auto">
            <div className="flex flex-col sm:flex-row justify-end items-center gap-4 px-32">
              {/* Stok ve sıralama kontrolleri */}
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-white py-4 cursor-pointer">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                      className="w-[18px] h-[18px] border-2 border-[#a4a4a5] checked:bg-[#00ff00] checked:border-[#00ff00] appearance-none cursor-pointer"
                    />
                    {filters.inStock && (
                      <svg
                        className="absolute w-[18px] h-[18px] pointer-events-none"
                        viewBox="0 0 515.556 515.556"
                        fill="black"
                      >
                        <path d="m0 274.226 176.549 176.886 339.007-338.672-48.67-47.997-290.337 290-128.553-128.552z"/>
                      </svg>
                    )}
                  </div>
                  Stoktakiler
                </label>

                {/* Sıralama dropdown */}
                <div className="relative w-80 sort-dropdown">
                  <button
                    onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                    className={`w-full flex items-center justify-between text-white px-4 h-[56px] border-l border-r ${
                      isSortMenuOpen ? 'border border-[#00ff00] bg-[#161617]' : 'border-gray-500 bg-[#000000]'
                    }`}
                  >
                    <div className="flex-1 text-left">
                      <span className={`${isSortMenuOpen ? 'text-[#00ff00]' : 'text-white'}`}>
                        {sortBy === "default" ? "SIRALA: MONSTER'IN SEÇİMİ" : sortOptions.find(option => option.value === sortBy)?.label}
                      </span>
                    </div>
                    <div className="flex-shrink-0 w-6">
                      {isSortMenuOpen ? (
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          color="#00ff00"
                        >
                          <path strokeLinecap="butt" strokeLinejoin="miter" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      ) : (
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                        >
                          <path strokeLinecap="butt" strokeLinejoin="miter" strokeWidth={2} d="M3 6h18M3 12h12M3 18h6" />
                        </svg>
                      )}
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isSortMenuOpen && (
                    <div className="absolute top-full left-0 w-full mt-0 bg-[#000000] shadow-lg z-50">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setIsSortMenuOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 hover:bg-[#333333] text-white ${
                            sortBy === option.value ? 'text-[#00ff00]' : ''
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sol Taraf - Kategoriler */}
          <div className="lg:w-1/4">
            <div className="pt-6 px-12 mb-5">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                categoryCounts={categoryCounts}
              />
            </div>

            <div className="px-12 mb-4 pb-5">
              <p> ÖZELLİK SEÇİMİ</p>
            </div>

            {/* Sol Taraf - Filtreler */}
            <div className="px-12">
              <SpecificationFilter 
                filters={filters}
                onFilterChange={setFilters}
                portSpecifications={portSpecifications}
              />
            </div>
          </div>

          {/* Sağ Taraf - Banner ve Ürünler */}
          <div className="lg:w-3/4 px-28 pt-6">
            {/* Banner Alanı */}
            {getBanner('main', 'main-1') && (
              <div className="mb-6">
                <div className="overflow-hidden">
                  <img 
                    src={getImageUrl(getBanner('main', 'main-1')?.imageUrl)}
                    alt={getBanner('main', 'main-1')?.alt}
                    className="w-full object-contain"
                    onLoad={() => console.log('Banner resmi başarıyla yüklendi')}
                    onError={(e) => {
                      console.error('Banner resmi yüklenemedi, URL:', getImageUrl(getBanner('main', 'main-1')?.imageUrl));
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}

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

            {!loading && !error && (
              <>
                <div className="mb-4">
                  {/* Aktif Filtreler */}
                  {(filters.processor || 
                    filters.processorArchitecture || 
                    filters.graphics || 
                    filters.memory || 
                    filters.display || 
                    filters.os || 
                    filters.firstPort || 
                    filters.secondPort || 
                    filters.priceRange.min > 0 || 
                    filters.priceRange.max < Infinity) && (
                    <div>
                      <div className="flex justify-between items-center pb-3">
                        <h3 className="text-gray-700 font-medium">TERCİHLER</h3>
                        <button
                          onClick={() => setFilters({
                            processor: "",
                            processorArchitecture: "",
                            graphics: "",
                            memory: "",
                            storage: "",
                            display: "",
                            priceRange: { min: 0, max: Infinity },
                            inStock: false,
                            os: "",
                            firstPort: "",
                            secondPort: ""
                          })}
                          className="text-sm text-[#00ff00] hover:text-[#00cc00]"
                        >
                          HEPSİNİ TEMİZLE
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {filters.processorArchitecture && (
                          <span className="inline-flex items-center border border-[#707070] rounded-sm px-2 py-1 text-xs bg-[#323334] text-white">
                            {filters.processorArchitecture}
                            <button
                              onClick={() => setFilters(prev => ({ ...prev, processorArchitecture: "" }))}
                              className="ml-4 text-white hover:text-gray-300"
                            >
                              ×
                            </button>
                          </span>
                        )}

                        {filters.graphics && (
                          <span className="inline-flex items-center border border-[#707070] rounded-sm px-2 py-1 text-xs bg-[#323334] text-white">
                            {filters.graphics}
                            <button
                              onClick={() => setFilters(prev => ({ ...prev, graphics: "" }))}
                              className="ml-4 text-white hover:text-gray-300"
                            >
                              ×
                            </button>
                          </span>
                        )}

                        {filters.processor && (
                          <span className="inline-flex items-center border border-[#707070] rounded-sm px-2 py-1 text-xs bg-[#323334] text-white">
                            {filters.processor}
                            <button
                              onClick={() => setFilters(prev => ({ ...prev, processor: "" }))}
                              className="ml-4 text-white hover:text-gray-300"
                            >
                              ×
                            </button>
                          </span>
                        )}

                        {filters.display && (
                          <span className="inline-flex items-center border border-[#707070] rounded-sm px-2 py-1 text-xs bg-[#323334] text-white">
                            {filters.display}
                            <button
                              onClick={() => setFilters(prev => ({ ...prev, display: "" }))}
                              className="ml-4 text-white hover:text-gray-300"
                            >
                              ×
                            </button>
                          </span>
                        )}

                        {filters.memory && (
                          <span className="inline-flex items-center border border-[#707070] rounded-sm px-2 py-1 text-xs bg-[#323334] text-white">
                            {filters.memory}
                            <button
                              onClick={() => setFilters(prev => ({ ...prev, memory: "" }))}
                              className="ml-4 text-white hover:text-gray-300"
                            >
                              ×
                            </button>
                          </span>
                        )}

                        {filters.firstPort && (
                          <span className="inline-flex items-center border border-[#707070] rounded-sm px-2 py-1 text-xs bg-[#323334] text-white">
                            {portSpecifications.firstPort.find(p => p.value === filters.firstPort)?.display}
                            <button
                              onClick={() => setFilters(prev => ({ ...prev, firstPort: "" }))}
                              className="ml-4 text-white hover:text-gray-300"
                            >
                              ×
                            </button>
                          </span>
                        )}

                        {filters.secondPort && (
                          <span className="inline-flex items-center border border-[#707070] rounded-sm px-2 py-1 text-xs bg-[#323334] text-white">
                            {portSpecifications.secondPort.find(p => p.value === filters.secondPort)?.display}
                            <button
                              onClick={() => setFilters(prev => ({ ...prev, secondPort: "" }))}
                              className="ml-4 text-white hover:text-gray-300"
                            >
                              ×
                            </button>
                          </span>
                        )}

                        {filters.os && (
                          <span className="inline-flex items-center border border-[#707070] rounded-sm px-2 py-1 text-xs bg-[#323334] text-white">
                            {filters.os}
                            <button
                              onClick={() => setFilters(prev => ({ ...prev, os: "" }))}
                              className="ml-4 text-white hover:text-gray-300"
                            >
                              ×
                            </button>
                          </span>
                        )}

                        {(filters.priceRange.min > 0 || filters.priceRange.max < Infinity) && (
                          <span className="inline-flex items-center border border-[#707070] rounded-sm px-2 py-1 text-xs bg-[#323334] text-white">
                            {filters.priceRange.min.toLocaleString('tr-TR')} ₺ - {
                              filters.priceRange.max === Infinity 
                                ? 'Üzeri' 
                                : filters.priceRange.max.toLocaleString('tr-TR') + ' ₺'
                            }
                            <button
                              onClick={() => setFilters(prev => ({ 
                                ...prev, 
                                priceRange: { min: 0, max: Infinity }
                              }))}
                              className="ml-4 text-white hover:text-gray-300"
                            >
                              ×
                            </button>
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4">
                  {pagination.totalProducts} ürün bulundu
                  </div>
                </div>

                <div className={`
                  ${viewMode === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'flex flex-col gap-6'
                  }
                `}>
                  {Array.isArray(filteredProducts) && filteredProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      getImageUrl={getImageUrl}
                    />
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Ürün Bulunamadı
                    </h3>
                    <p className="text-gray-600">
                      Seçtiğiniz filtrelere uygun ürün bulunmamaktadır. Lütfen filtrelerinizi değiştirin.
                    </p>
                  </div>
                )}

                {/* Ürün listesi sonuna pagination UI ekle */}
                <div className="mt-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!pagination.hasPrevPage}
                        className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50 text-black"
                      >
                        Önceki
                      </button>

                      {/* Sayfa numaraları */}
                      {Array.from({ length: pagination.totalPages }, (_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => handlePageChange(i + 1)}
                          className={`px-4 py-2 rounded ${
                            currentPage === i + 1 ? 'bg-[#00ff00] text-black' : 'bg-black text-[#00ff00]'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!pagination.hasNextPage}
                        className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50 text-black"
                      >
                        Sonraki
                      </button>
                    </div>

                    {/* Toplam ürün bilgisi */}
                    <div className="text-sm">
                      Toplam {pagination.totalProducts} üründen{' '}
                      {(currentPage - 1) * pagination.limit + 1}-
                      {Math.min(currentPage * pagination.limit, pagination.totalProducts)}{' '}
                      arası gösteriliyor.
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}