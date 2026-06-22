import fs from 'fs';
import path from 'path';

const DB_PATH = path.resolve('server/db.json');

// Ensure database file and uploads directory exist
const initLocalDB = () => {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const uploadsDir = path.resolve('server/uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({
      users: [],
      bookings: [],
      gallery: [],
      videos: [],
      testimonials: [],
      pricing: [],
      about: [],
      contacts: [],
      quotes: []
    }, null, 2));
  }
};

initLocalDB();

const readDB = () => {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  } catch (error) {
    return {
      users: [],
      bookings: [],
      gallery: [],
      videos: [],
      testimonials: [],
      pricing: [],
      about: [],
      contacts: [],
      quotes: []
    };
  }
};

const writeDB = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

class MockModel {
  constructor(collectionKey) {
    this.collectionKey = collectionKey;
  }

  async find(filter = {}) {
    const db = readDB();
    const items = db[this.collectionKey] || [];
    
    return items.filter(item => {
      for (const key in filter) {
        // Handle basic matches
        if (filter[key] !== undefined && item[key] !== filter[key]) {
          return false;
        }
      }
      return true;
    });
  }

  async findOne(filter = {}) {
    const results = await this.find(filter);
    return results[0] || null;
  }

  async findById(id) {
    return this.findOne({ _id: id });
  }

  async create(data) {
    const db = readDB();
    const newItem = {
      _id: Math.random().toString(36).substring(2, 11) + Date.now().toString(36),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    if (!db[this.collectionKey]) {
      db[this.collectionKey] = [];
    }
    db[this.collectionKey].push(newItem);
    writeDB(db);
    return newItem;
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const db = readDB();
    const items = db[this.collectionKey] || [];
    const index = items.findIndex(item => item._id === id);
    if (index === -1) return null;

    // Apply updates
    const updatedFields = update.$set ? { ...items[index], ...update.$set } : { ...items[index], ...update };
    const updatedItem = {
      ...updatedFields,
      updatedAt: new Date().toISOString()
    };

    items[index] = updatedItem;
    db[this.collectionKey] = items;
    writeDB(db);
    return updatedItem;
  }

  async findByIdAndDelete(id) {
    const db = readDB();
    const items = db[this.collectionKey] || [];
    const index = items.findIndex(item => item._id === id);
    if (index === -1) return null;

    const [deletedItem] = items.splice(index, 1);
    db[this.collectionKey] = items;
    writeDB(db);
    return deletedItem;
  }

  async deleteOne(filter = {}) {
    const db = readDB();
    const items = db[this.collectionKey] || [];
    const index = items.findIndex(item => {
      for (const key in filter) {
        if (item[key] !== filter[key]) return false;
      }
      return true;
    });

    if (index === -1) return { deletedCount: 0 };
    items.splice(index, 1);
    db[this.collectionKey] = items;
    writeDB(db);
    return { deletedCount: 1 };
  }

  async countDocuments(filter = {}) {
    const results = await this.find(filter);
    return results.length;
  }
}

export const getModel = (collectionKey, mongooseModel) => {
  const mock = new MockModel(collectionKey);
  return new Proxy(mongooseModel, {
    get(target, prop) {
      if (global.isMongoConnected) {
        return target[prop];
      }
      if (typeof mock[prop] === 'function') {
        return mock[prop].bind(mock);
      }
      return undefined;
    }
  });
};
