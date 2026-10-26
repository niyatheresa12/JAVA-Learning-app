export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return formatDate(dateString);
};

export const getCategoryColor = (category) => {
  const cat = (category || '').toLowerCase();
  switch (cat) {
    case 'engineering':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'design':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'database':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'devops':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'career':
      return 'bg-pink-50 text-pink-700 border-pink-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};
