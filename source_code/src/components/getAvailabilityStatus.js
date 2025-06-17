export const getAvailabilityStatus = (releaseDate, hasProviders) => {
  if (!releaseDate) return "Release date unknown";

  const today = new Date();
  const release = new Date(releaseDate);

  //get displayable date of release
  const formatReleaseDate = (release) => {
    if (!release) return null;
    const date = new Date(release);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
};

  // Normalize both to midnight
  today.setHours(0, 0, 0, 0);
  release.setHours(0, 0, 0, 0);

  if (release.getTime() > today.getTime()) {
    return `${formatReleaseDate(releaseDate)}`;
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
