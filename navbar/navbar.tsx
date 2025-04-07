"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Üst Banner */}
      <div className="bg-[#000000]">
        <div className="flex justify-end">
          <ul className="flex text-xs">
            <li>
              <Link href="/" className="text-[#a4a4a5] hover:text-[#00ff00] px-4 py-2 inline-block flex items-center gap-1">
                İLETİŞİM VE MAĞAZALAR
              </Link>
            </li>
            <li>
              <Link href="/" className="text-[#ffa200] hover:text-[#00ff00] px-4 py-2 inline-block flex items-center gap-1">
                CANAVARINI SEÇ
              </Link>
            </li>
            <li>
              <Link href="/" className="text-[#a4a4a5] hover:text-[#00ff00] px-4 py-2 inline-block flex items-center gap-1">
                TAMAMLAYICI GARANTİ
              </Link>
            </li>
            <li>
              <Link href="/" className="text-[#a4a4a5] hover:text-[#00ff00] px-4 py-2 inline-block flex items-center gap-1">
                DESTEK <span className="text-[8px]">▼</span>
              </Link>
            </li>
            <li>
              <Link href="/" className="text-[#a4a4a5] hover:text-[#00ff00] px-4 py-2 inline-block flex items-center gap-1">
                TEKNİK SERVİS <span className="text-[8px]">▼</span>
              </Link>
            </li>
            <li>
              <Link href="/" className="text-[#a4a4a5] hover:text-[#00ff00] px-4 py-2 inline-block flex items-center gap-1">
                RANDEVU SİSTEMİ <span className="text-[8px]">▼</span>
              </Link>
            </li>
            <li>
              <Link href="/" className="text-[#a4a4a5] hover:text-[#00ff00] px-4 py-2 inline-block flex items-center gap-1">
                ÇÖZÜM MERKEZİ <span className="text-[8px]">▼</span>
              </Link>
            </li>
            <li>
              <Link href="/" className="text-[#a4a4a5] hover:text-[#00ff00] px-4 py-2 inline-block flex items-center gap-1">
                ÖMÜR BOYU BAKIM <span className="text-[8px]">▼</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Ana Navbar */}
      <div className="bg-[#000000] border-b border-[#1a1a1a]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="w-[160px]">
              <Link href="/">
                <Image 
                  src="/monster-logo.svg" 
                  alt="Monster Notebook" 
                  width={160} 
                  height={42}
                  className="w-auto h-[42px]"
                />
              </Link>
            </div>

            {/* Arama Çubuğu */}
            <div className="flex-grow max-w-[640px] mx-8">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Arama Yap" 
                  className="w-full h-[40px] bg-[#1b1c1d] text-[#a4a4a5] px-4
                           focus:outline-none text-[13px] rounded-none"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2">
                  <svg 
                    className="w-4 h-4 text-[#a4a4a5]" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Sağ Alan - Login/Sepet */}
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="bg-[#1b1c1d] text-[#00ff00] hover:bg-[#00ff00] hover:text-black
                         px-5 py-2 text-[13px] transition-colors"
              >
                Harcı Ödeme
              </Link>
              <div className="flex items-center gap-6 ml-2">
                <Link href="/" className="flex items-center gap-2">
                  <svg 
                    className="w-5 h-5 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                    />
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-white text-[13px]">Giriş Yap</span>
                    <span className="text-[#666] text-[11px]">Kayıt Ol</span>
                  </div>
                </Link>
                <div className="relative">
                  <Link href="/" className="flex items-center">
                    <svg 
                      className="w-6 h-6 text-white" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                      />
                    </svg>
                    <span className="absolute -top-1 -right-1 bg-[#00ff00] text-black 
                                   w-4 h-4 rounded-full flex items-center justify-center 
                                   text-[10px] font-medium">
                      0
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alt Menü - Kategoriler */}
      <div className="bg-[#000000] border-b border-[#1a1a1a]">
        <div className="container mx-auto">
          <ul className="flex items-center justify-between px-4 h-[48px] text-[13px]">
            <li>
              <Link 
                href="/" 
                className="text-white hover:text-[#00ff00] transition-colors"
              >
                TÜM LAPTOPLAR
              </Link>
            </li>
            <li>
              <Link 
                href="/" 
                className="text-white hover:text-[#00ff00] transition-colors flex items-center gap-1"
              >
                OYUN BİLGİSAYARLARI
                <span className="bg-[#ffa200] text-black text-[10px] px-1 rounded">YENİ</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/" 
                className="text-white hover:text-[#00ff00] transition-colors"
              >
                MASAÜSTÜ BİLGİSAYARLAR
              </Link>
            </li>
            <li>
              <Link 
                href="/" 
                className="text-white hover:text-[#00ff00] transition-colors"
              >
                İŞ BİLGİSAYARLARI
              </Link>
            </li>
            <li>
              <Link 
                href="/" 
                className="text-white hover:text-[#00ff00] transition-colors"
              >
                AKSESUARLAR
              </Link>
            </li>
            <li>
              <Link 
                href="/" 
                className="text-white hover:text-[#00ff00] transition-colors"
              >
                OYUNCU MONİTÖRÜ
              </Link>
            </li>
            <li>
              <Link 
                href="/" 
                className="text-white hover:text-[#00ff00] transition-colors"
              >
                CPU & GPU
              </Link>
            </li>
            <li>
              <Link 
                href="/" 
                className="text-white hover:text-[#00ff00] transition-colors"
              >
                BELLEK & EKRAN
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
