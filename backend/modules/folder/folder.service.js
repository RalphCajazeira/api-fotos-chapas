const knex = require("../../database/connection");

async function createFolder(name, driveId, parentId = null) {
  const existing = await knex("folders")
    .where({ name, parent_id: parentId })
    .first();

  if (existing) {
    throw new Error(`❌ Folder "${name}" already exists in this directory`);
  }

  const [id] = await knex("folders")
    .insert({ name, drive_id: driveId, parent_id: parentId })
    .returning("id");

  return { id, name, drive_id: driveId, parent_id: parentId };
}

async function getAllFolders() {
  return await knex("folders").select("*").orderBy("id", "asc");
}

async function renameFolder(id, newName) {
  await knex("folders").where({ id }).update({ name: newName });
  return true;
}

async function deleteFolder(id) {
  await knex("folders").where({ id }).del();
  return true;
}

module.exports = {
  createFolder,
  getAllFolders,
  renameFolder,
  deleteFolder,
};
