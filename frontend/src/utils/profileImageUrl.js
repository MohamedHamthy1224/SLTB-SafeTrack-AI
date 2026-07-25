import defaultAvatar from '../assets/images/default_driver_avatar.png';

export const getProfileImageUrl = (photoPath, updatedAt) => {
  if (!photoPath) return defaultAvatar;
  if (photoPath.startsWith('http')) return photoPath;
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
  const url = `${baseUrl}/api/v1/sltb/${photoPath}`;
  if (updatedAt) {
    const version = typeof updatedAt === 'string' ? encodeURIComponent(updatedAt) : Date.now();
    return `${url}?v=${version}`;
  }
  return url;
};

export default getProfileImageUrl;
