import {
  getAdminEventImageSrc,
  handleAdminEventImageError,
} from './mapApiEventToAdminEvent';

type AdminEventImageProps = {
  imageUrl: string | null;
  alt?: string;
  className?: string;
};

export default function AdminEventImage({
  imageUrl,
  alt = '',
  className,
}: AdminEventImageProps) {
  return (
    <img
      src={getAdminEventImageSrc(imageUrl)}
      alt={alt}
      className={className}
      onError={handleAdminEventImageError}
    />
  );
}
