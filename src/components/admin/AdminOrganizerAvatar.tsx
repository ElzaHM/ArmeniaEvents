import { useEffect, useState } from 'react';

type AdminOrganizerAvatarProps = {
  name: string;
  avatarUrl?: string | null;
  avatarClassName?: string;
  fallbackClassName?: string;
};

export default function AdminOrganizerAvatar({
  name,
  avatarUrl,
  avatarClassName,
  fallbackClassName,
}: AdminOrganizerAvatarProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [avatarUrl]);

  const initial = name.charAt(0).toUpperCase() || '?';

  if (!avatarUrl?.trim() || failed) {
    return (
      <span className={fallbackClassName} aria-hidden="true">
        {initial}
      </span>
    );
  }

  return (
    <img
      src={avatarUrl}
      alt=""
      className={avatarClassName}
      onError={() => setFailed(true)}
    />
  );
}
