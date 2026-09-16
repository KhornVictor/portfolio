export interface WantedPosterProps {
  imageUrl?: string;
  name?: string;
  bounty?: number | string;
}

export const formatBounty = (bounty: number | string): string => {
  return `${Number(bounty).toLocaleString('en-US')}`;
};