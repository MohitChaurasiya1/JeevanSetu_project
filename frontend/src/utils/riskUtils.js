export const getRiskBadgeColor = (level) => {
  switch (level?.toUpperCase()) {
    case 'LOW': return 'bg-green-100 text-green-800';
    case 'MODERATE': return 'bg-yellow-100 text-yellow-800';
    case 'HIGH': return 'bg-orange-100 text-orange-800';
    case 'CRITICAL': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
