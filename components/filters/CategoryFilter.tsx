import React, { useState, useEffect } from 'react';
import { FiChevronRight } from 'react-icons/fi';

interface Category {
    _id: string;
    name: string;
    slug: string;
    fullSlug: string;
    parent?: string;
    subcategories?: Category[];
}
  
interface CategoryFilterProps {
    categories: Category[];
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    categoryCounts?: {
        _id: string;
        name: string;
        slug: string;
        fullSlug: string;
        filteredCount: number;
    }[];
}
  
export default function CategoryFilter({ 
    categories = [],
    selectedCategory, 
    onCategoryChange,
    categoryCounts = []
}: CategoryFilterProps) {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['laptoplar']));
    const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(true);

    const getFilteredCount = (categoryFullSlug: string) => {
        const categoryCount = categoryCounts?.find(c => c.fullSlug === categoryFullSlug);
        return categoryCount?.filteredCount || 0;
    };

    const renderCategory = (category: Category, level: number = 0) => {
        const hasSubcategories = category.subcategories && category.subcategories.length > 0;
        const isExpanded = expandedCategories.has(category.fullSlug);
        const isSelected = selectedCategory === category.fullSlug;

        const filteredCount = getFilteredCount(category.fullSlug);

        return (
            <div key={category._id} className="category-item">
                <div 
                    className={`flex items-center py-2 px-2 rounded-md transition-colors ${
                        isSelected 
                            ? 'text-[#00ff00]' 
                            : selectedCategory.includes(category.fullSlug)
                                ? 'text-white'
                                : 'text-[#A4A4A5]'
                    }`}
                    style={{ marginLeft: `${level * 2}px` }}
                >
                    <div 
                        className={`flex-1 cursor-pointer flex items-center`}
                        onClick={() => {
                            onCategoryChange(category.fullSlug);
                            setExpandedCategories(prev => {
                                const next = new Set<string>();
                                prev.forEach(slug => {
                                    if (slug.split('/').length !== category.fullSlug.split('/').length) {
                                        next.add(slug);
                                    }
                                    else if (category.fullSlug.includes(slug) || slug.includes(category.fullSlug)) {
                                        next.add(slug);
                                    }
                                });
                                next.add(category.fullSlug);
                                return next;
                            });
                        }}
                    >
                        <span className="flex-1">
                            {category.name} ({filteredCount})
                        </span>
                        {hasSubcategories && (
                            <FiChevronRight 
                                className={`transform transition-transform duration-200 text-[#00ff00] ml-2 ${isExpanded ? 'rotate-90' : ''}`}
                                size={20}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedCategories(prev => {
                                        const next = new Set(prev);
                                        if (next.has(category.fullSlug)) {
                                            next.delete(category.fullSlug);
                                        } else {
                                            const currentLevel = category.fullSlug.split('/').length;
                                            prev.forEach(slug => {
                                                if (slug.split('/').length === currentLevel && 
                                                    slug.split('/').slice(0, -1).join('/') === category.fullSlug.split('/').slice(0, -1).join('/')) {
                                                    next.delete(slug);
                                                }
                                            });
                                            next.add(category.fullSlug);
                                        }
                                        return next;
                                    });
                                }}
                            />
                        )}
                    </div>
                </div>

                {hasSubcategories && isExpanded && (
                    <div className="ml-4">
                        {category.subcategories?.map(subcategory => 
                            renderCategory(subcategory, level + 1)
                        )}
                    </div>
                )}
            </div>
        );
    };
  
    return (
        <div className="category-filter border border-[#323334] shadow-sm bg-custom-gradient">
            <div 
                className="pl-4 flex items-center justify-between cursor-pointer mb-0 border-b border-[#323334] p-2"
                onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
            >
                <h3 className="text-lg text-white font-semibold">Kategoriler</h3>
                <FiChevronRight 
                    className={`transform transition-transform duration-200 text-[#00ff00] ${isCategoriesExpanded ? 'rotate-90' : ''}`}
                    size={20}
                />
            </div>
            <div className={`pl-2 space-y-1 ${isCategoriesExpanded ? 'block' : 'hidden'}`}>
                {categories.map(category => renderCategory(category))}
            </div>
        </div>
    );
}