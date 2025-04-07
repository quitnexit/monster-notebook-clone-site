"use client";
import { useState, useEffect } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface FilterSection {
  title: string;
  isOpen: boolean;
}

interface LaptopFiltersProps {
  onFilterChange: (filters: Record<string, any>) => void;
}

export default function LaptopFilters({ onFilterChange }: LaptopFiltersProps) {
  const [sections, setSections] = useState<Record<string, boolean>>({
    price: true,
    processor: true,
    graphics: true,
    memory: true,
    storage: true,
    display: true,
    stock: true,
  });

  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    processor: '',
    graphics: '',
    memory: '',
    storage: '',
    display: '',
    stock: 'all'
  });

  const toggleSection = (section: string) => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const FilterSection = ({ title, children, isOpen, onToggle }: any) => (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={onToggle}
        className="flex justify-between items-center w-full text-left font-medium text-gray-700 hover:text-blue-500"
      >
        {title}
        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
      </button>
      {isOpen && <div className="mt-4">{children}</div>}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Filtreler</h2>

      {/* Fiyat Aralığı */}
      <FilterSection
        title="Fiyat Aralığı"
        isOpen={sections.price}
        onToggle={() => toggleSection('price')}
      >
        <div className="flex gap-4 items-center">
          <input
            type="number"
            min="0"
            value={filters.priceRange[0]}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              priceRange: [parseInt(e.target.value), prev.priceRange[1]]
            }))}
            className="w-full px-3 py-2 border rounded"
            placeholder="Min"
          />
          <span>-</span>
          <input
            type="number"
            min="0"
            value={filters.priceRange[1]}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              priceRange: [prev.priceRange[0], parseInt(e.target.value)]
            }))}
            className="w-full px-3 py-2 border rounded"
            placeholder="Max"
          />
        </div>
      </FilterSection>

      {/* İşlemci */}
      <FilterSection
        title="İşlemci"
        isOpen={sections.processor}
        onToggle={() => toggleSection('processor')}
      >
        <select
          value={filters.processor}
          onChange={(e) => setFilters(prev => ({ ...prev, processor: e.target.value }))}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="">Tümü</option>
          <option value="intel">Intel</option>
          <option value="amd">AMD</option>
        </select>
      </FilterSection>

      {/* Ekran Kartı */}
      <FilterSection
        title="Ekran Kartı"
        isOpen={sections.graphics}
        onToggle={() => toggleSection('graphics')}
      >
        <select
          value={filters.graphics}
          onChange={(e) => setFilters(prev => ({ ...prev, graphics: e.target.value }))}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="">Tümü</option>
          <option value="nvidia">NVIDIA</option>
          <option value="amd">AMD</option>
          <option value="intel">Intel</option>
        </select>
      </FilterSection>

      {/* RAM */}
      <FilterSection
        title="RAM"
        isOpen={sections.memory}
        onToggle={() => toggleSection('memory')}
      >
        <select
          value={filters.memory}
          onChange={(e) => setFilters(prev => ({ ...prev, memory: e.target.value }))}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="">Tümü</option>
          <option value="8">8 GB</option>
          <option value="16">16 GB</option>
          <option value="32">32 GB</option>
          <option value="64">64 GB</option>
        </select>
      </FilterSection>

      {/* Stok Durumu */}
      <FilterSection
        title="Stok Durumu"
        isOpen={sections.stock}
        onToggle={() => toggleSection('stock')}
      >
        <select
          value={filters.stock}
          onChange={(e) => setFilters(prev => ({ ...prev, stock: e.target.value }))}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="all">Tümü</option>
          <option value="inStock">Stokta Var</option>
          <option value="outOfStock">Stokta Yok</option>
        </select>
      </FilterSection>

      {/* Filtreleri Sıfırla */}
      <button
        onClick={() => {
          setFilters({
            priceRange: [0, 100000],
            processor: '',
            graphics: '',
            memory: '',
            storage: '',
            display: '',
            stock: 'all'
          });
        }}
        className="mt-6 w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 transition-colors"
      >
        Filtreleri Sıfırla
      </button>
    </div>
  );
}