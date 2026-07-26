const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { getUseFallback } = require('../config/db');

// --- MongoDB Mongoose Schema ---
const perfumeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  size: { type: String, required: true },
  notes: {
    top: [{ type: String }],
    middle: [{ type: String }],
    base: [{ type: String }]
  },
  family: { type: String, required: true },
  image: { type: String, required: true },
  longevity: { type: Number, min: 1, max: 5, default: 3 },
  sillage: { type: Number, min: 1, max: 5, default: 3 },
  gender: { type: String, required: true }
}, {
  timestamps: true
});

const MongoosePerfume = mongoose.model('Perfume', perfumeSchema);

// --- Local JSON Fallback Configuration ---
const dataDir = path.join(__dirname, '../data');
const jsonFilePath = path.join(dataDir, 'perfumes.json');

const initialPerfumes = [
  {
    id: "1",
    name: "Oud Imperial",
    brand: "Anora Brand",
    description: "A deep, mysterious journey into the heart of the Orient. Warm spices, rich agarwood (oud), and golden amber form a powerful, long-lasting, and regal scent profile that demands presence.",
    price: "145$",
    size: "100ml",
    notes: {
      top: ["Cardamom", "Pink Pepper", "Nutmeg"],
      middle: ["Agarwood (Oud)", "Damask Rose", "Patchouli"],
      base: ["Sandalwood", "Amber", "White Musk", "Leather"]
    },
    family: "Woody",
    image: "/images/perfumes/oud_imperial.jpg",
    longevity: 5,
    sillage: 5,
    gender: "Unisex"
  },
  {
    id: "2",
    name: "Rose de Nuit",
    brand: "Anora Brand",
    description: "A velvet night in Paris. A sensual, dark, and romantic blend of damask rose, sweet chocolatey praline, and warm patchouli. Perfect for cold evenings and romantic encounters.",
    price: "130$",
    size: "100ml",
    notes: {
      top: ["Red Fruits", "Bergamot", "Saffron"],
      middle: ["Damask Rose", "Jasmine", "Violet"],
      base: ["Praline", "Vanilla", "Patchouli", "Oudh"]
    },
    family: "Floral",
    image: "/images/perfumes/rose_de_nuit.jpg",
    longevity: 4,
    sillage: 4,
    gender: "Women"
  },
  {
    id: "3",
    name: "Citrus Nectar",
    brand: "Anora Brand",
    description: "A refreshing burst of Mediterranean sunshine. Crisp, sparkling bergamot, sweet orange nectar, and fresh salty sea breeze. Invigorating and clean, ideal for hot summer days.",
    price: "110$",
    size: "100ml",
    notes: {
      top: ["Bergamot", "Mandarin Orange", "Lemon"],
      middle: ["Sea Salt", "Neroli", "Ginger"],
      base: ["Cedarwood", "White Musk", "Vetiver"]
    },
    family: "Citrus",
    image: "/images/perfumes/citrus_nectar.jpg",
    longevity: 3,
    sillage: 3,
    gender: "Unisex"
  },
  {
    id: "4",
    name: "Vétiver Sauvage",
    brand: "Anora Brand",
    description: "Bold, earthy, and sophisticated. A clean woody fragrance highlighting green vetiver, smoke, and black pepper. It projects an air of timeless elegance and natural charisma.",
    price: "125$",
    size: "100ml",
    notes: {
      top: ["Grapefruit", "Black Pepper", "Bergamot"],
      middle: ["Vetiver", "Geranium", "Sichuan Pepper"],
      base: ["Cedarwood", "Patchouli", "Benzoin"]
    },
    family: "Woody",
    image: "/images/perfumes/vetiver_sauvage.jpg",
    longevity: 4,
    sillage: 3,
    gender: "Men"
  }
];

// Ensure JSON file exists and contains initial data
const ensureJsonFileExists = () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(jsonFilePath)) {
    fs.writeFileSync(jsonFilePath, JSON.stringify(initialPerfumes, null, 2), 'utf-8');
    console.log('Created local JSON perfumes database with default items.');
  }
};

const readJsonData = () => {
  ensureJsonFileExists();
  try {
    const data = fs.readFileSync(jsonFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading JSON file database:', error);
    return initialPerfumes;
  }
};

const writeJsonData = (data) => {
  ensureJsonFileExists();
  try {
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing JSON file database:', error);
    return false;
  }
};

// --- Unified Database Access Service Layer ---
const PerfumeService = {
  getAll: async () => {
    if (getUseFallback()) {
      return readJsonData();
    } else {
      // If DB is empty, insert initial perfumes
      const count = await MongoosePerfume.countDocuments();
      if (count === 0) {
        await MongoosePerfume.insertMany(initialPerfumes.map(({id, ...rest}) => rest));
      }
      return await MongoosePerfume.find({});
    }
  },

  getById: async (id) => {
    if (getUseFallback()) {
      const perfumes = readJsonData();
      return perfumes.find(p => p.id === id) || null;
    } else {
      try {
        return await MongoosePerfume.findById(id);
      } catch (err) {
        return null;
      }
    }
  },

  create: async (perfumeData) => {
    if (getUseFallback()) {
      const perfumes = readJsonData();
      const newPerfume = {
        id: Date.now().toString(),
        ...perfumeData
      };
      perfumes.push(newPerfume);
      writeJsonData(perfumes);
      return newPerfume;
    } else {
      const newPerfume = new MongoosePerfume(perfumeData);
      return await newPerfume.save();
    }
  },

  update: async (id, perfumeData) => {
    if (getUseFallback()) {
      const perfumes = readJsonData();
      const index = perfumes.findIndex(p => p.id === id);
      if (index === -1) return null;
      
      perfumes[index] = { ...perfumes[index], ...perfumeData };
      writeJsonData(perfumes);
      return perfumes[index];
    } else {
      try {
        return await MongoosePerfume.findByIdAndUpdate(id, perfumeData, { new: true });
      } catch (err) {
        return null;
      }
    }
  },

  delete: async (id) => {
    if (getUseFallback()) {
      const perfumes = readJsonData();
      const index = perfumes.findIndex(p => p.id === id);
      if (index === -1) return false;
      
      perfumes.splice(index, 1);
      writeJsonData(perfumes);
      return true;
    } else {
      try {
        const result = await MongoosePerfume.findByIdAndDelete(id);
        return !!result;
      } catch (err) {
        return false;
      }
    }
  }
};

module.exports = { PerfumeService, MongoosePerfume };
