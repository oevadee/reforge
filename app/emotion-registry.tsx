'use client';

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import type { Options as CacheOptions } from '@emotion/cache';

interface EmotionRegistryProps {
  options?: CacheOptions;
  children: React.ReactNode;
}

export default function EmotionRegistry({
  options,
  children,
}: EmotionRegistryProps): React.JSX.Element {
  const [cache] = useState(() => {
    const cache = createCache(options ?? { key: 'css' });
    cache.compat = true;
    return cache;
  });

  useServerInsertedHTML(() => {
    const entries = Object.entries(cache.inserted);
    if (entries.length === 0) return null;

    return (
      <style
        data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: entries
            .map(([_name, value]) => {
              if (typeof value === 'boolean') return null;
              return value;
            })
            .filter(Boolean)
            .join('\n'),
        }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
