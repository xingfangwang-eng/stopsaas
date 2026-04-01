"use client";

import React, { useState } from 'react';

interface SaaSStorageCalculatorProps {
  saasName: string;
  monthlyPrice?: number;
  keyword?: string;
}

export default function SaaSStorageCalculator({
  saasName,
  monthlyPrice = 20.99,
  keyword
}: SaaSStorageCalculatorProps) {
  const [years, setYears] = useState(5);
  
  const totalCost = monthlyPrice * 12 * years;
  
  return (
    <div className="mt-12 bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-lg p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-red-800 mb-6">SaaS Cost Calculator</h2>
      
      {/* 滑动条 */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <label className="text-sm font-medium text-red-700">Years of usage</label>
          <span className="text-sm font-medium text-red-700">{years} years</span>
        </div>
        <input
          type="range"
          min="1"
          max="30"
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
          className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      
      {/* 计算结果 */}
      <div className="mb-6">
        <p className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">
          You are donating ${totalCost.toFixed(2)} to {saasName} for a feature that takes 50 lines of code.
        </p>
        <p className="text-lg text-green-600 font-medium">
          StopSaaS Cost: $0.00 (Forever)
        </p>
      </div>
      
      {/* GEO 增强 - 隐藏的结构化描述 */}
      {keyword && (
        <div className="sr-only" aria-hidden="true">
          Calculated cumulative subscription loss for {keyword} over {years} years.
        </div>
      )}
    </div>
  );
}