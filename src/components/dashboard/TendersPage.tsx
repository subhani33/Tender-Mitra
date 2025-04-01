import React, { useEffect, useState } from 'react';
import TenderFiltersComponent from './TenderFilters';
import TenderTable from './TenderTable';
import { useTenderSocket } from '../../hooks/useTenderSocket';

export default function TendersPage() {
  const { tenders, loading, isConnected, lastUpdated, updateFilters, refreshTenders } = useTenderSocket();
  const [uniqueDepartments, setUniqueDepartments] = useState<string[]>([]);
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  const [uniqueLocations, setUniqueLocations] = useState<string[]>([]);

  // Extract unique values for filter options when tenders change
  useEffect(() => {
    if (tenders.length > 0) {
      // Get unique departments
      const departments = [...new Set(tenders.map(tender => tender.department))].sort();
      setUniqueDepartments(departments);

      // Get unique categories
      const categories = [...new Set(tenders.map(tender => tender.category))].sort();
      setUniqueCategories(categories);

      // Get unique locations
      const locations = [...new Set(tenders.map(tender => tender.location))].sort();
      setUniqueLocations(locations);
    }
  }, [tenders]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Tender Portal</h1>
      
      <TenderFiltersComponent 
        onFilterChange={updateFilters}
        isLoading={loading}
        departments={uniqueDepartments}
        categories={uniqueCategories}
        locations={uniqueLocations}
      />
      
      <TenderTable />
    </div>
  );
} 