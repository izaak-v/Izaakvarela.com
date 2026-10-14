import Image from "next/image";
import { profile } from "@/content/profile";
import { isDev } from "@/lib/env";

type Props = { priority?: boolean; sizes: string; className?: string };

export function Portrait({ priority, sizes, className = "" }: Props) {
  const photo = profile.photo;
  return (
    <div className={`portrait ${className}`}>
      <span className="portrait-corner tl" aria-hidden="true" />
      <span className="portrait-corner br" aria-hidden="true" />
      <div className="portrait-inner">
        {photo ? (
          <Image
            src={photo.src}
            width={photo.width}
            height={photo.height}
            alt={photo.alt}
            sizes={sizes}
            priority={priority}
          />
        ) : isDev ? (
          <div className="portrait-fallback dev">
            Photo placeholder
            <small>Set profile.photo in content/profile.ts</small>
          </div>
        ) : (
          <div className="portrait-fallback" aria-hidden="true">
            IV
          </div>
        )}
      </div>
    </div>
  );
}
