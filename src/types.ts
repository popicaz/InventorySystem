/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minThreshold: number;
  lastUpdated: string;
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  lastOrder: string;
  status: 'active' | 'inactive';
}

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}
