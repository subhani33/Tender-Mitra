/**
 * Setup script for Tender Opulence Hub
 * This script creates necessary directories and logs instructions for required assets
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current module
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Directories to create
const directories = [
    'public/textures',
    'public/models',
    'public/images',
];

// Create directories if they don't exist
directories.forEach(dir => {
    const fullPath = path.join(rootDir, dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
    } else {
        console.log(`✅ Directory already exists: ${dir}`);
    }
});

// Assets required for the project
const requiredAssets = {
    textures: [
        'black-marble.jpg',
        'gold-veins.png',
        'crystal-normal.jpg',
        'earth-blue-marble.jpg',
        'velvet-texture.jpg',
        'parchment.jpg',
        'book-cover-gold.jpg',
        'book-cover-emerald.jpg',
        'book-cover-blue.jpg',
        'book-cover-purple.jpg',
        'book-cover-copper.jpg',
    ],
    models: [
        'vault-door.glb',
    ],
    images: [
        'og-image.jpg',
        'twitter-image.jpg',
        'readme-banner.jpg',
    ]
};

// Check which assets are missing
const missingAssets = {};

Object.entries(requiredAssets).forEach(([category, assets]) => {
    const categoryPath = path.join(rootDir, 'public', category);
    const missing = assets.filter(asset => !fs.existsSync(path.join(categoryPath, asset)));

    if (missing.length > 0) {
        missingAssets[category] = missing;
    }
});

// Print instructions for missing assets
console.log('\n🎨 Tender Opulence Hub - Asset Setup');
console.log('==============================================');

if (Object.keys(missingAssets).length === 0) {
    console.log('✨ All required assets are in place!');
} else {
    console.log('⚠️  The following assets are required but missing:');

    Object.entries(missingAssets).forEach(([category, assets]) => {
        console.log(`\n📂 ${category.toUpperCase()}:`);
        assets.forEach(asset => {
            console.log(`   - ${asset}`);
        });
    });

    console.log('\n📝 Instructions:');
    console.log('1. Place the missing asset files in their respective directories');
    console.log('2. You can use placeholder images during development');
    console.log('   Example: https://placehold.co/600x400/1A2A44/D4AF37?text=Texture');
    console.log('3. For 3D models, you can create simple ones using Three.js primitives if needed\n');
}

console.log('✅ Setup complete!');
console.log('==============================================');
console.log('📚 Run "npm run dev" to start the development server');
console.log('🔗 The application will be available at http://localhost:5173\n');