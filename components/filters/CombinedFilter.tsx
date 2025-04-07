import React, { useState } from 'react';
import CategoryFilter from './CategoryFilter';
import SpecificationFilter from './SpecificationFilter';

interface CombinedFilterProps {
  categories: any[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  filters: any;
  onFilterChange: (filters: any) => void;
  filteredProductCount: number;
  products: any[];
}

export default function CombinedFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  filters,
  onFilterChange,
  filteredProductCount,
  products
}: CombinedFilterProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedSpecifications, setExpandedSpecifications] = useState(false);

  const toggleCategory = (categorySlug: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categorySlug)) {
        next.delete(categorySlug);
      } else {
        next.add(categorySlug);
      }
      return next;
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 cursor-pointer" onClick={() => setExpandedSpecifications(!expandedSpecifications)}>
          Özellik Seçimi {expandedSpecifications ? '−' : '+'}
        </h3>
        {expandedSpecifications && (
          <SpecificationFilter filters={filters} onFilterChange={onFilterChange} />
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 cursor-pointer" onClick={() => toggleCategory('categories')}>
          Kategoriler {expandedCategories.size > 0 ? '−' : '+'}
        </h3>
        {expandedCategories.size > 0 && (
          <div className="space-y-2">
            {categories.map(category => (
              <div key={category._id} className="flex justify-between items-center">
                <span className="text-gray-700 cursor-pointer" onClick={() => onCategoryChange(category.fullSlug)}>
                  {category.name} ({products.filter(p => p.category.fullSlug.startsWith(category.fullSlug)).length})
                </span>
                <button onClick={() => toggleCategory(category.fullSlug)} className="text-green-500">
                  {expandedCategories.has(category.fullSlug) ? '−' : '+'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 