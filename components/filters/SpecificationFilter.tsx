import React, { useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';

interface FilterOptions {
    processor: string;
    processorArchitecture: string;
    graphics: string;
    memory: string;
    storage: string;
    display: string;
    priceRange: { min: number; max: number };
    inStock: boolean;
    os: string;
    firstPort: string;
    secondPort: string;
  }
  
  interface SpecificationFilterProps {
    filters: FilterOptions;
    onFilterChange: (filters: FilterOptions) => void;
    portSpecifications: {
      firstPort: Array<{ display: string; value: string }>;
      secondPort: Array<{ display: string; value: string }>;
    };
  }
  
  const priceRanges = [
    { min: 0, max: 15000, label: "0 - 15.000 ₺" },
    { min: 15000, max: 25000, label: "15.000 ₺ - 25.000 ₺" },
    { min: 25000, max: 35000, label: "25.000 ₺ - 35.000 ₺" },
    { min: 35000, max: 50000, label: "35.000 ₺ - 50.000 ₺" },
    { min: 50000, max: Infinity, label: "50.000 ₺ ve üzeri" }
  ];
  
  const specifications = {
    processorArchitectures: ["13. Nesil", "12. Nesil", "Core Ultra Series 1", "14. Nesil", "Core Ultra Series 2"],
    processors: ["i7-13700HX", "i7-1255U", "i7-13700H", "i5-1235U", "i7-12700H", "i5-13500H", "i9-13980HX", "Ultra 7 155H", "i9-14900HX", "i5-12450H", "Ultra 7 256V", "Ultra 7 258V"],
    graphics: ["6GB RTX 4050", "8GB RTX 4060", "8GB RTX 4070", "12GB RTX 3500 192-Bit", "6GB RTX 3050 96-Bit", "12GB RTX4080 192Bit", "4GB RTX 2050", "16GB RTX 5000 256-Bit", "Intel Arc Graphics", "Intel Arc 140V", "Intel® Iris® Xe"],
    memory: ["2x16GB 4800MHz", "2x8GB 5600MHz", "2x16GB 5600MHz", "2x16GB 4000MHz", "2x32GB 4000MHz", "4x32GB 3600MHz", "16GB 8533 MHz", "2x32GB 4800MHz", "32GB 8533MHz", "2x8GB 4800MHz", "1x8GB 3200MHz", "2x8GB 3200MHz", "2x16GB 3200MHz"],
    display: ["13.3\"", "14\"", "15.6\"", "16\"", "17.3\""],
    operatingSystems: ["Windows 11 Home", "Windows 11 Pro", "Windows 10 Home", "Windows 10 Pro", "FreeDos"],
    firstPort: [
        { display: "256GB M.2 SSD", value: "256GB" },
        { display: "500GB M.2 SSD", value: "500GB" },
        { display: "1TB M.2 SSD", value: "1TB" },
        { display: "2TB M.2 SSD", value: "2TB" }
    ],
    secondPort: [
        { display: "256GB M.2 SSD", value: "256GB" },
        { display: "500GB M.2 SSD", value: "500GB" },
        { display: "1TB M.2 SSD", value: "1TB" },
        { display: "2TB M.2 SSD", value: "2TB" },
        { display: "Boş M.2 Slot", value: "Takılı Değil" }
    ]
  };
  
  export default function SpecificationFilter({ filters, onFilterChange, portSpecifications }: SpecificationFilterProps) {
    const [isPriceExpanded, setPriceExpanded] = useState(true);
    const [isArchitectureExpanded, setArchitectureExpanded] = useState(true);
    const [isProcessorExpanded, setProcessorExpanded] = useState(true);
    const [isGraphicsExpanded, setGraphicsExpanded] = useState(true);
    const [isMemoryExpanded, setMemoryExpanded] = useState(true);
    const [isStorageExpanded, setStorageExpanded] = useState(true);
    const [isDisplayExpanded, setDisplayExpanded] = useState(true);
    const [isOsExpanded, setIsOsExpanded] = useState(true);
    const [isFirstPortExpanded, setIsFirstPortExpanded] = useState(true);
    const [isSecondPortExpanded, setIsSecondPortExpanded] = useState(true);
  
    const handleFilterChange = (key: keyof FilterOptions, value: any) => {
      onFilterChange({ ...filters, [key]: value });
    };
  
    return (
      <div className="space-y-6">

        {/* İşlemci Mimarisi */}
        <div className="border border-[#323334] shadow-sm bg-custom-gradient mb-6">
          <div className="pl-4 flex items-center justify-between cursor-pointer mb-0 border-b border-[#323334] p-2"
               onClick={() => setArchitectureExpanded(!isArchitectureExpanded)}>
            <h3 className="text-lg text-white font-semibold">İşlemci Mimarisi</h3>
            <FiChevronRight 
              className={`transform transition-transform duration-200 text-[#00ff00] ${isArchitectureExpanded ? 'rotate-90' : ''}`}
              size={20}
            />
          </div>
          
          <div className={`p-4 space-y-2 ${isArchitectureExpanded ? 'block' : 'hidden'}`}>
            {specifications.processorArchitectures.map((arch, index) => (
              <label key={index} className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="radio"
                    name="processorArchitecture"
                    checked={filters.processorArchitecture === arch}
                    onChange={() => {}}
                    onClick={(e) => {
                      if (filters.processorArchitecture === arch) {
                        onFilterChange({
                          ...filters,
                          processorArchitecture: ""
                        });
                        e.preventDefault();
                      } else {
                        onFilterChange({
                          ...filters,
                          processorArchitecture: arch
                        });
                      }
                    }}
                    className="appearance-none w-4 h-4 border border-[#323334] rounded-sm checked:bg-[#00ff00] checked:border-transparent cursor-pointer"
                  />
                  {filters.processorArchitecture === arch && (
                    <svg 
                      className="absolute top-0 left-0 w-4 h-4 text-black pointer-events-none" 
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 10l4 4L16 6" />
                    </svg>
                  )}
                </div>
                <span className="text-[#A4A4A5]">{arch}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Ekran Kartı */}
        <div className="border border-[#323334] shadow-sm bg-custom-gradient mb-6">
          <div className="pl-4 flex items-center justify-between cursor-pointer mb-0 border-b border-[#323334] p-2"
               onClick={() => setGraphicsExpanded(!isGraphicsExpanded)}>
            <h3 className="text-lg text-white font-semibold">Ekran Kartı</h3>
            <FiChevronRight 
              className={`transform transition-transform duration-200 text-[#00ff00] ${isGraphicsExpanded ? 'rotate-90' : ''}`}
              size={20}
            />
          </div>
          
          <div className={`p-4 space-y-2 ${isGraphicsExpanded ? 'block' : 'hidden'}`}>
            {specifications.graphics.map((graphics, index) => (
              <label key={index} className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="radio"
                    name="graphics"
                    checked={filters.graphics === graphics}
                    onChange={() => {}}
                    onClick={(e) => {
                      if (filters.graphics === graphics) {
                        onFilterChange({
                          ...filters,
                          graphics: ""
                        });
                        e.preventDefault();
                      } else {
                        onFilterChange({
                          ...filters,
                          graphics: graphics
                        });
                      }
                    }}
                    className="appearance-none w-4 h-4 border border-[#323334] rounded-sm checked:bg-[#00ff00] checked:border-transparent cursor-pointer"
                  />
                  {filters.graphics === graphics && (
                    <svg 
                      className="absolute top-0 left-0 w-4 h-4 text-black pointer-events-none" 
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 10l4 4L16 6" />
                    </svg>
                  )}
                </div>
                <span className="text-[#A4A4A5]">{graphics}</span>
              </label>
            ))}
          </div>
        </div>

        {/* İşlemci */}
        <div className="border border-[#323334] shadow-sm bg-custom-gradient mb-6">
          <div className="pl-4 flex items-center justify-between cursor-pointer mb-0 border-b border-[#323334] p-2"
               onClick={() => setProcessorExpanded(!isProcessorExpanded)}>
            <h3 className="text-lg text-white font-semibold">İşlemci</h3>
            <FiChevronRight 
              className={`transform transition-transform duration-200 text-[#00ff00] ${isProcessorExpanded ? 'rotate-90' : ''}`}
              size={20}
            />
          </div>
          
          <div className={`p-4 space-y-2 ${isProcessorExpanded ? 'block' : 'hidden'}`}>
            {specifications.processors.map((proc, index) => (
              <label key={index} className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="radio"
                    name="processor"
                    checked={filters.processor === proc}
                    onChange={() => {}}
                    onClick={(e) => {
                      if (filters.processor === proc) {
                        onFilterChange({
                          ...filters,
                          processor: ""
                        });
                        e.preventDefault();
                      } else {
                        onFilterChange({
                          ...filters,
                          processor: proc
                        });
                      }
                    }}
                    className="appearance-none w-4 h-4 border border-[#323334] rounded-sm checked:bg-[#00ff00] checked:border-transparent cursor-pointer"
                  />
                  {filters.processor === proc && (
                    <svg 
                      className="absolute top-0 left-0 w-4 h-4 text-black pointer-events-none" 
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 10l4 4L16 6" />
                    </svg>
                  )}
                </div>
                <span className="text-[#A4A4A5]">{proc}</span>
              </label>
            ))}
          </div>
        </div>     


        {/* Ekran Boyutu */}
        <div className="border border-[#323334] shadow-sm bg-custom-gradient mb-6">
          <div className="pl-4 flex items-center justify-between cursor-pointer mb-0 border-b border-[#323334] p-2"
               onClick={() => setDisplayExpanded(!isDisplayExpanded)}>
            <h3 className="text-lg text-white font-semibold">Ekran Boyutu</h3>
            <FiChevronRight 
              className={`transform transition-transform duration-200 text-[#00ff00] ${isDisplayExpanded ? 'rotate-90' : ''}`}
              size={20}
            />
          </div>
          
          <div className={`p-4 space-y-2 ${isDisplayExpanded ? 'block' : 'hidden'}`}>
            {specifications.display.map((display, index) => (
              <label key={index} className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="radio"
                    name="display"
                    checked={filters.display === display}
                    onChange={() => {}}
                    onClick={(e) => {
                      if (filters.display === display) {
                        onFilterChange({
                          ...filters,
                          display: ""
                        });
                        e.preventDefault();
                      } else {
                        onFilterChange({
                          ...filters,
                          display: display
                        });
                      }
                    }}
                    className="appearance-none w-4 h-4 border border-[#323334] rounded-sm checked:bg-[#00ff00] checked:border-transparent cursor-pointer"
                  />
                  {filters.display === display && (
                    <svg 
                      className="absolute top-0 left-0 w-4 h-4 text-black pointer-events-none" 
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 10l4 4L16 6" />
                    </svg>
                  )}
                </div>
                <span className="text-[#A4A4A5]">{display}</span>
              </label>
            ))}
          </div>
        </div>   


        {/* RAM */}
        <div className="border border-[#323334] shadow-sm bg-custom-gradient mb-6">
          <div className="pl-4 flex items-center justify-between cursor-pointer mb-0 border-b border-[#323334] p-2"
               onClick={() => setMemoryExpanded(!isMemoryExpanded)}>
            <h3 className="text-lg text-white font-semibold">RAM</h3>
            <FiChevronRight 
              className={`transform transition-transform duration-200 text-[#00ff00] ${isMemoryExpanded ? 'rotate-90' : ''}`}
              size={20}
            />
          </div>
          
          <div className={`p-4 space-y-2 ${isMemoryExpanded ? 'block' : 'hidden'}`}>
            {specifications.memory.map((memory, index) => (
              <label key={index} className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="radio"
                    name="memory"
                    checked={filters.memory === memory}
                    onChange={() => {}}
                    onClick={(e) => {
                      if (filters.memory === memory) {
                        onFilterChange({
                          ...filters,
                          memory: ""
                        });
                        e.preventDefault();
                      } else {
                        onFilterChange({
                          ...filters,
                          memory: memory
                        });
                      }
                    }}
                    className="appearance-none w-4 h-4 border border-[#323334] rounded-sm checked:bg-[#00ff00] checked:border-transparent cursor-pointer"
                  />
                  {filters.memory === memory && (
                    <svg 
                      className="absolute top-0 left-0 w-4 h-4 text-black pointer-events-none" 
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 10l4 4L16 6" />
                    </svg>
                  )}
                </div>
                <span className="text-[#A4A4A5]">{memory}</span>
              </label>
            ))}
          </div>
        </div>


        {/* 1. Port M.2 SSD */}
        <div className="border border-[#323334] shadow-sm bg-custom-gradient mb-6">
            <div className="pl-4 flex items-center justify-between cursor-pointer mb-0 border-b border-[#323334] p-2"
                 onClick={() => setIsFirstPortExpanded(!isFirstPortExpanded)}>
                <h3 className="text-lg text-white font-semibold">1. Port M.2 SSD</h3>
                <FiChevronRight 
                    className={`transform transition-transform duration-200 text-[#00ff00] ${isFirstPortExpanded ? 'rotate-90' : ''}`}
                    size={20}
                />
            </div>
            
            <div className={`p-4 space-y-2 ${isFirstPortExpanded ? 'block' : 'hidden'}`}>
                {specifications.firstPort.map((option, index) => (
                    <label key={index} className="flex items-center gap-2 cursor-pointer">
                        <div className="relative">
                            <input
                                type="radio"
                                name="firstPort"
                                checked={filters.firstPort === option.value}
                                onChange={() => {}}
                                onClick={(e) => {
                                    if (filters.firstPort === option.value) {
                                        onFilterChange({
                                            ...filters,
                                            firstPort: ""
                                        });
                                        e.preventDefault();
                                    } else {
                                        onFilterChange({
                                            ...filters,
                                            firstPort: option.value
                                        });
                                    }
                                }}
                                className="appearance-none w-4 h-4 border border-[#323334] rounded-sm checked:bg-[#00ff00] checked:border-transparent cursor-pointer"
                            />
                            {filters.firstPort === option.value && (
                                <svg 
                                    className="absolute top-0 left-0 w-4 h-4 text-black pointer-events-none" 
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M4 10l4 4L16 6" />
                                </svg>
                            )}
                        </div>
                        <span className="text-[#A4A4A5]">{option.display}</span>
                    </label>
                ))}
            </div>
        </div>
  
        {/* 2. Port M.2 SSD */}
        <div className="border border-[#323334] shadow-sm bg-custom-gradient mb-6">
            <div className="pl-4 flex items-center justify-between cursor-pointer mb-0 border-b border-[#323334] p-2"
                 onClick={() => setIsSecondPortExpanded(!isSecondPortExpanded)}>
                <h3 className="text-lg text-white font-semibold">2. Port M.2 SSD</h3>
                <FiChevronRight 
                    className={`transform transition-transform duration-200 text-[#00ff00] ${isSecondPortExpanded ? 'rotate-90' : ''}`}
                    size={20}
                />
            </div>
            
            <div className={`p-4 space-y-2 ${isSecondPortExpanded ? 'block' : 'hidden'}`}>
                {specifications.secondPort.map((option, index) => (
                    <label key={index} className="flex items-center gap-2 cursor-pointer">
                        <div className="relative">
                            <input
                                type="radio"
                                name="secondPort"
                                checked={filters.secondPort === option.value}
                                onChange={() => {}}
                                onClick={(e) => {
                                    if (filters.secondPort === option.value) {
                                        onFilterChange({
                                            ...filters,
                                            secondPort: ""
                                        });
                                        e.preventDefault();
                                    } else {
                                        onFilterChange({
                                            ...filters,
                                            secondPort: option.value
                                        });
                                    }
                                }}
                                className="appearance-none w-4 h-4 border border-[#323334] rounded-sm checked:bg-[#00ff00] checked:border-transparent cursor-pointer"
                            />
                            {filters.secondPort === option.value && (
                                <svg 
                                    className="absolute top-0 left-0 w-4 h-4 text-black pointer-events-none" 
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M4 10l4 4L16 6" />
                                </svg>
                            )}
                        </div>
                        <span className="text-[#A4A4A5]">{option.display}</span>
                    </label>
                ))}
            </div>
        </div>

        {/* İşletim Sistemi */}
        <div className="border border-[#323334] shadow-sm bg-custom-gradient mb-6">
          <div className="pl-4 flex items-center justify-between cursor-pointer mb-0 border-b border-[#323334] p-2"
               onClick={() => setIsOsExpanded(!isOsExpanded)}>
            <h3 className="text-lg text-white font-semibold">İşletim Sistemi</h3>
            <FiChevronRight 
              className={`transform transition-transform duration-200 text-[#00ff00] ${isOsExpanded ? 'rotate-90' : ''}`}
              size={20}
            />
          </div>
          
          <div className={`p-4 space-y-2 ${isOsExpanded ? 'block' : 'hidden'}`}>
            {specifications.operatingSystems.map((os, index) => (
              <label key={index} className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="radio"
                    name="os"
                    checked={filters.os === os}
                    onChange={() => {}}
                    onClick={(e) => {
                      if (filters.os === os) {
                        onFilterChange({
                          ...filters,
                          os: ""
                        });
                        e.preventDefault();
                      } else {
                        onFilterChange({
                          ...filters,
                          os: os
                        });
                      }
                    }}
                    className="appearance-none w-4 h-4 border border-[#323334] rounded-sm checked:bg-[#00ff00] checked:border-transparent cursor-pointer"
                  />
                  {filters.os === os && (
                    <svg 
                      className="absolute top-0 left-0 w-4 h-4 text-black pointer-events-none" 
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 10l4 4L16 6" />
                    </svg>
                  )}
                </div>
                <span className="text-[#A4A4A5]">{os}</span>
              </label>
            ))}
          </div>
        </div>


        {/* Fiyat Aralığı */}
        <div className="border border-[#323334] shadow-sm bg-custom-gradient mb-6">
          <div className="pl-4 flex items-center justify-between cursor-pointer mb-0 border-b border-[#323334] p-2"
               onClick={() => setPriceExpanded(!isPriceExpanded)}>
            <h3 className="text-lg text-white font-semibold">Fiyat</h3>
            <FiChevronRight 
              className={`transform transition-transform duration-200 text-[#00ff00] ${isPriceExpanded ? 'rotate-90' : ''}`}
              size={20}
            />
          </div>
          
          <div className={`p-4 space-y-2 ${isPriceExpanded ? 'block' : 'hidden'}`}>
            {priceRanges.map((range, index) => (
              <label key={index} className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                <input
                  type="radio"
                  name="priceRange"
                  checked={filters.priceRange.min === range.min && filters.priceRange.max === range.max}
                    onChange={(e) => {
                      // Radio button requires onChange for React controlled component,
                      // but main functionality is handled in onClick event
                    }}
                    onClick={(e) => {
                      if (filters.priceRange.min === range.min && filters.priceRange.max === range.max) {
                        onFilterChange({
                          ...filters,
                          priceRange: { min: 0, max: Infinity }
                        });
                        e.preventDefault();
                      } else {
                        onFilterChange({
                          ...filters,
                          priceRange: { min: range.min, max: range.max }
                        });
                      }
                    }}
                    className="appearance-none w-4 h-4 border border-[#323334] rounded-sm checked:bg-[#00ff00] checked:border-transparent cursor-pointer"
                  />
                  {filters.priceRange.min === range.min && filters.priceRange.max === range.max && (
                    <svg 
                      className="absolute top-0 left-0 w-4 h-4 text-black pointer-events-none" 
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 10l4 4L16 6" />
                    </svg>
                  )}
                </div>
                <span className="text-[#A4A4A5]">{range.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  }

// specifications objesinden port verilerini alıp dışarı açalım
export const portSpecifications = {
  firstPort: specifications.firstPort,
  secondPort: specifications.secondPort
};