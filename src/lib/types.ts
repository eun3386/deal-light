export type Category = { id: string; name: string; emoji: string };

export type Item = {
  id: string;
  categoryId: string;
  name: string;
  aliases: string[];
  unit: string;
  min: number;
  avg: number;
  ripoff: number;
  note?: string;
};

export type Store = {
  id: string;
  number: string;
  name: string;
  floor: 1 | 2;
  x: number;
  y: number;
  categories: string[];
  fixedPrice: boolean;
  description: string;
};

export type Scam = {
  id: string;
  title: string;
  summary: string;
  tip: string;
  severity: 1 | 2 | 3;
};

export type Location = "han" | "night" | "etc";

export type Report = {
  id: string;
  itemId: string;
  price: number;
  quantity: number;
  storeNumber?: string;
  location: Location;
  createdAt: string;
};

export type Review = {
  id: string;
  storeId: string;
  rating: number;
  content: string;
  createdAt: string;
};
