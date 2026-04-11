export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatKm(km: number): string {
  return new Intl.NumberFormat('en-CA').format(km) + ' km';
}

export function getAuctionStatus(auctionStart: string): 'upcoming' | 'live' | 'ended' {
  const start = new Date(auctionStart);
  const now = new Date();
  // Normalize: treat auction dates as relative to now for prototype
  // Auctions last 24 hours from their start time
  // Shift all auction times to be relative to today for demo purposes
  const daysSinceData = Math.floor((now.getTime() - new Date('2026-04-03T12:00:00').getTime()) / (1000 * 60 * 60 * 24));
  const adjustedStart = new Date(start.getTime() + daysSinceData * 24 * 60 * 60 * 1000);
  const adjustedEnd = new Date(adjustedStart.getTime() + 24 * 60 * 60 * 1000);

  if (now < adjustedStart) return 'upcoming';
  if (now > adjustedEnd) return 'ended';
  return 'live';
}

export function getTimeRemaining(auctionStart: string): string {
  const start = new Date(auctionStart);
  const now = new Date();
  const daysSinceData = Math.floor((now.getTime() - new Date('2026-04-03T12:00:00').getTime()) / (1000 * 60 * 60 * 24));
  const adjustedStart = new Date(start.getTime() + daysSinceData * 24 * 60 * 60 * 1000);
  const adjustedEnd = new Date(adjustedStart.getTime() + 24 * 60 * 60 * 1000);

  const diff = adjustedEnd.getTime() - now.getTime();
  if (diff <= 0) return 'Ended';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
}

export function conditionLabel(grade: number): string {
  if (grade >= 4.5) return 'Excellent';
  if (grade >= 3.5) return 'Good';
  if (grade >= 2.5) return 'Fair';
  if (grade >= 1.5) return 'Below Average';
  return 'Poor';
}

export function conditionColor(grade: number): string {
  if (grade >= 4.5) return 'text-emerald-600';
  if (grade >= 3.5) return 'text-green-600';
  if (grade >= 2.5) return 'text-yellow-600';
  if (grade >= 1.5) return 'text-orange-600';
  return 'text-red-600';
}
