import * as SQLite from 'expo-sqlite';
import * as MediaLibrary from 'expo-media-library';
import { transformFileSync } from '@babel/core';


export const initDB = async (): Promise<void> => {

    try {
            // Create or open the database
    const db = await SQLite.openDatabaseAsync("myDatabase.db");

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS assets (
            uri VARCHAR(255) PRIMARY KEY NOT NULL, 
            name VARCHAR(255),
            date VARCHAR(255) NOT NULL,
            imageGroup VARCHAR(255)
        );
    `)

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS categories (
            name VARCHAR(255) PRIMARY KEY NOT NULL,
            color VARCHAR(255)
        );

        INSERT OR IGNORE INTO categories (name, color) VALUES ('new', '#2596be');
        
    `)

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS assetHasCategory (
            id INTEGER PRIMARY KEY NOT NULL,
            uri VARCHAR(255) NOT NULL,
            category VARCHAR(255) NOT NULL
        );
    `) 
    console.log("Database inialized successfuly")
    } catch (error) {
        console.log(`Error in database initialization Error: ${error}`)
    }


    
}

/**
 * 
 * @param assets 
 * 
 * This function store new assets if not exists in the database
 * Make two new entries
 * 
 * asset = {
 *  uri: the new uri,
 *  name: No-named,
 *  date: image creation date
 * }
 * 
 * and the relation with the 'new' category
 * 
 * assetHasCategory = {
 *      uri: the new uri,
 *      category: "new"
 * }
 * 
 */
export const storeNewAssets = async (assets: MediaLibrary.Asset[]): Promise<void> => {

    const db = await SQLite.openDatabaseAsync("myDatabase.db");

    for(const asset of assets){
        // Check if the asset exists
        const oldAsset = await db.getFirstAsync(`SELECT * FROM assets WHERE uri = ${asset.uri}`)

        if(!oldAsset){
            await db.runAsync(`
                    INSERT INTO assets (uri, name, date) VALUES (?, ?, ?), ${asset.uri}, ${asset.filename || 'No-named'}, ${asset.creationTime}
                `)
            
            await db.runAsync(`
                    INSERT INTO assetHasCategory (uri, category) VALUES (?, ?), ${asset.uri}, 'new'
                `)
        }
        
    }
}


export const getAllAssets = async (): Promise<any[]> => {
    const db = await SQLite.openDatabaseAsync("myDatabase.db");

    const assets = await db.getAllAsync(`
            SELECT * FROM assets
        `)
    return assets
}


