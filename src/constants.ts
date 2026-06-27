/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { InventoryItem } from './types';

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: '1',
    name: 'Dizüstü Bilgisayar (MacBook Pro)',
    category: 'Elektronik',
    quantity: 12,
    unit: 'Adet',
    minThreshold: 5,
    lastUpdated: '2024-03-20',
  },
  {
    id: '2',
    name: 'Monitör 27"',
    category: 'Elektronik',
    quantity: 8,
    unit: 'Adet',
    minThreshold: 5,
    lastUpdated: '2024-03-18',
  },
  {
    id: '3',
    name: 'Kablosuz Mouse',
    category: 'Aksesuar',
    quantity: 4,
    unit: 'Adet',
    minThreshold: 10,
    lastUpdated: '2024-03-15',
  },
  {
    id: '4',
    name: 'A4 Kağıt (Paket)',
    category: 'Sarf Malzemesi',
    quantity: 45,
    unit: 'Paket',
    minThreshold: 15,
    lastUpdated: '2024-03-19',
  },
  {
    id: '5',
    name: 'Sandalyeler',
    category: 'Mobilya',
    quantity: 3,
    unit: 'Adet',
    minThreshold: 5,
    lastUpdated: '2024-03-10',
  },
  {
    id: '6',
    name: 'HDMI Kablo',
    category: 'Elektronik',
    quantity: 15,
    unit: 'Adet',
    minThreshold: 8,
    lastUpdated: '2024-03-12',
  },
  {
    id: '7',
    name: 'Masa Lambası',
    category: 'Mobilya',
    quantity: 2,
    unit: 'Adet',
    minThreshold: 4,
    lastUpdated: '2024-03-14',
  }
];

export const INITIAL_CUSTOMERS: any[] = [
  { id: 'c1', name: 'Zeynep Kaya', company: 'TechNova Mimarlık', lastOrder: '2024-03-01', status: 'active' },
  { id: 'c2', name: 'Murat Demir', company: 'Global Çözümler A.Ş.', lastOrder: '2024-02-15', status: 'active' },
  { id: 'c3', name: 'Selin Yıldız', company: 'Yıldız Lojistik', lastOrder: '2024-01-20', status: 'active' }
];

export const CRITICAL_THRESHOLD = 5;
