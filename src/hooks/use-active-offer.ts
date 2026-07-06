import { useCallback, useState } from 'react';

type ResultActiveOffer = [
  string | null,
  (offerId: string) => void,
  () => void,
];

export const useActiveOffer = (): ResultActiveOffer => {
  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);

  const handleCardMouseEnter = useCallback((offerId: string) => {
    setActiveOfferId(offerId);
  }, []);

  const handleCardMouseLeave = useCallback(() => {
    setActiveOfferId(null);
  }, []);

  return [activeOfferId, handleCardMouseEnter, handleCardMouseLeave];
};
