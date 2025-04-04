/**
 * Migration gerada automaticamente por Cody para criar a tabela folders
 */
exports.up = function(knex) {
  return knex.schema.createTable('folders', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('drive_id').notNullable();
    table.integer('parent_id').nullable().references('id').inTable('folders').onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('folders');
};
