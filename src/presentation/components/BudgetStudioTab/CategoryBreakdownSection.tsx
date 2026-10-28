import React from 'react';
import { CategoryBreakdown } from '../../../domain/budget';
import { formatINR } from '../../../domain/currency';

interface CategoryBreakdownSectionProps {
  categoryBreakdowns: CategoryBreakdown[];
}

export const CategoryBreakdownSection: React.FC<CategoryBreakdownSectionProps> = ({
  categoryBreakdowns,
}) => {
  return (
    <div className="scrapbook-card p-6 bg-white">
      <h2 className="font-heading font-bold text-sm text-plum uppercase tracking-wider mb-3">
        Category Distribution
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categoryBreakdowns.map((cat) => (
          <div key={cat.category} className="p-3 rounded-xl bg-cream-50 border border-plum/20">
            <div className="flex justify-between items-center text-xs font-bold text-plum mb-1">
              <span className="capitalize">{cat.category}</span>
              <span>{formatINR(cat.effectivePaise)}</span>
            </div>
            <div className="w-full h-2 bg-cream-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-lavender-300 rounded-full"
                style={{ width: `${Math.min(100, cat.percentageOfTotal)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-plum-light mt-1">
              <span>{cat.itemCount} items</span>
              <span>{cat.percentageOfTotal}% of total</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
