import * as SQLite from 'expo-sqlite';
import * as MediaLibrary from 'expo-media-library';
import constants from './const';
import { CategoryInterface } from './interfaces';

/**
 * 
 * @returns The SQLite connection.
 * 
 * Get the name from the constant values and make the connection to the database.
 * If the database doesn't exist this funciton create it.
 * 
 */
const getDBConnection = (): SQLite.SQLiteDatabase => {
    const db = SQLite.openDatabaseSync(constants.DATABASE)
    return db
}

export const initDB = async (): Promise<void> => {

    try {
    // Create or open the database
    const db =  getDBConnection();

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS assets (
            uri VARCHAR(255) PRIMARY KEY NOT NULL, 
            name VARCHAR(255),
            date INTEGER NOT NULL,
            imageGroup VARCHAR(255)
        );
    `)

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS categories (
            name VARCHAR(255) PRIMARY KEY NOT NULL,
            color VARCHAR(255),
            categoryGroup VARCHAR(255)
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

    await db.closeAsync()
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

    const db = getDBConnection();

    for(const asset of assets){
        try {
            // Check if the asset exists
            const countResult = await db.getFirstAsync(
                `SELECT COUNT(*) AS count FROM assets WHERE uri = ?`,
                [asset.uri]
              ) as {count: number};

            if(countResult.count === 0){
                console.log(`Trying to save asset with uri \`${asset.uri}\``)

                const isoString = new Date(asset.creationTime).toISOString()
                await db.runAsync(
                        `INSERT INTO assets (uri, name, date) VALUES (?, ?, ?)`, 
                        [asset.uri, "No-named", isoString]
                    )
                
                await db.runAsync(
                        `INSERT INTO assetHasCategory (uri, category) VALUES (?, ?)`, 
                        [asset.uri, "new"]
                    )
                
                console.log(`The asset with uri \`${asset.uri}\` saved successfuly`)
            }

            
        } catch (error) {
            console.log(`Error while asset was trying to be saved Error: ${error}`)
        }
    }
    console.log("Close connection")
    db.closeAsync()
}


export const getAllAssets = async (): Promise<any[]> => {
    const db = getDBConnection();

    const assets = await db.getAllAsync(`
            SELECT * FROM assets
        `)
    db.closeAsync()
    return assets
}

export const getAllCategories = async (): Promise<{name: string, color: string}[]> => {
    const db = getDBConnection();

    const categories:CategoryInterface[] = await db.getAllAsync(`
            SELECT * FROM categories
        `)
    db.closeAsync()
    return categories
}

export const insertCategory = async (category: CategoryInterface):Promise<void> => {
    const db = getDBConnection()

    await db.runAsync(
        `INSERT OR IGNORE INTO categories (name, color) VALUES (?, ?)`,[category.name, category.color]
    )
    db.closeAsync()
}

export const deleteCategory = async (category: string):Promise<void> => {
    try {
        const db = getDBConnection()

        await db.runAsync(
            `DELETE FROM categories WHERE name = $category`, {$category: category}
        )
        db.closeAsync()
    } catch (error) {
        console.log(error)
    }
   

}

