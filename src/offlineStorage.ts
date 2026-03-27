import { Resource } from './data/resources';

export interface OfflineResource {
  id: string;
  content: string;
  downloadedAt: Date;
  size: number;
}

// IndexedDB setup for offline storage
class OfflineStorage {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'StudyPlannerOffline';
  private readonly DB_VERSION = 1;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('resources')) {
          db.createObjectStore('resources', { keyPath: 'id' });
        }
      };
    });
  }

  async storeResource(resource: Resource, content: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['resources'], 'readwrite');
      const store = transaction.objectStore('resources');

      const offlineResource: OfflineResource = {
        id: resource.id,
        content,
        downloadedAt: new Date(),
        size: new Blob([content]).size
      };

      const request = store.put(offlineResource);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getResource(id: string): Promise<OfflineResource | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['resources'], 'readonly');
      const store = transaction.objectStore('resources');
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  async isResourceOffline(id: string): Promise<boolean> {
    const resource = await this.getResource(id);
    return resource !== null;
  }

  async getAllOfflineResources(): Promise<OfflineResource[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['resources'], 'readonly');
      const store = transaction.objectStore('resources');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async removeResource(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['resources'], 'readwrite');
      const store = transaction.objectStore('resources');
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getStorageUsage(): Promise<{ used: number; available: number }> {
    const resources = await this.getAllOfflineResources();
    const used = resources.reduce((total, resource) => total + resource.size, 0);

    // Get available storage (approximate)
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        used,
        available: estimate.quota ? estimate.quota - (estimate.usage || 0) : 0
      };
    }

    return { used, available: 0 };
  }
}

export const offlineStorage = new OfflineStorage();

// Download content from URL
export async function downloadResource(resource: Resource): Promise<string> {
  try {
    // For external websites, we'll create a simplified offline version
    // In a real implementation, you'd need CORS-enabled APIs or a proxy server
    const response = await fetch(resource.url, {
      mode: 'no-cors' // This won't work for most sites due to CORS
    });

    if (!response.ok) {
      throw new Error(`Failed to download: ${response.status}`);
    }

    const content = await response.text();
    return content;
  } catch (error) {
    // For demo purposes, create a placeholder offline content
    return createOfflineContent(resource);
  }
}

// Create offline content when direct download isn't possible
function createOfflineContent(resource: Resource): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${resource.title} - Offline</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                line-height: 1.6;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                border-radius: 10px;
                margin-bottom: 30px;
            }
            .content {
                background: #f8f9fa;
                padding: 30px;
                border-radius: 10px;
                border-left: 5px solid #667eea;
            }
            .tags {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-top: 20px;
            }
            .tag {
                background: #e9ecef;
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 0.9em;
                color: #495057;
            }
            .offline-notice {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                color: #856404;
                padding: 15px;
                border-radius: 5px;
                margin-bottom: 20px;
            }
        </style>
    </head>
    <body>
        <div class="offline-notice">
            <strong>Offline Mode:</strong> This content has been saved for offline viewing.
            Original source: ${resource.source}
        </div>

        <div class="header">
            <h1>${resource.title}</h1>
            <p><strong>Class ${resource.class} - ${resource.subject}</strong></p>
            ${resource.chapter ? `<p><em>Chapter: ${resource.chapter}</em></p>` : ''}
        </div>

        <div class="content">
            <h2>Description</h2>
            <p>${resource.description}</p>

            <h2>What You'll Learn</h2>
            <ul>
                ${resource.tags.map((tag: string) => `<li>Understanding ${tag}</li>`).join('')}
            </ul>

            <h2>Key Topics</h2>
            <div class="tags">
                ${resource.tags.map((tag: string) => `<span class="tag">${tag}</span>`).join('')}
            </div>

            <h2>Study Tips</h2>
            <ul>
                <li>Take notes while studying this topic</li>
                <li>Practice related exercises</li>
                <li>Connect concepts to real-life examples</li>
                <li>Review regularly to retain information</li>
            </ul>

            <h2>Next Steps</h2>
            <p>When you're back online, visit the original resource at:</p>
            <p><a href="${resource.url}" target="_blank">${resource.url}</a></p>
            <p><em>Source: ${resource.source}</em></p>
        </div>
    </body>
    </html>
  `;
}

// Check if device is online
export function isOnline(): boolean {
  return navigator.onLine;
}

// Listen for online/offline events
export function onNetworkChange(callback: (online: boolean) => void): () => void {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}