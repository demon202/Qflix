export const getAvailabilityStatus = (releaseDate, hasProviders) => {
  if (!releaseDate) return "Release date unknown";

  const today = new Date();
  const release = new Date(releaseDate);

  // Normalize both to midnight
  today.setHours(0, 0, 0, 0);
  release.setHours(0, 0, 0, 0);

  if (release.getTime() > today.getTime()) {
    return "Not released yet";
  }

  if (!hasProviders) {
    const diffInDays = (today - release) / (1000 * 60 * 60 * 24);
    if (diffInDays <= 60) {
      return "Only in Cinemas";
    } else {
      return "Not available";
    }
  }

  return null;
};
