exports.up = function (knex) {
    return knex.schema.createTable("files", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();             // Nome original
      table.string("drive_id").notNullable();         // ID do arquivo no Drive
      table
        .integer("folder_id")
        .unsigned()
        .references("id")
        .inTable("folders")
        .onDelete("CASCADE");                         // Apaga arquivos se a pasta for excluída
      table.string("internal_code");                  // Código interno do usuário
      table.decimal("width", 6, 2);                   // Largura
      table.decimal("height", 6, 2);                  // Comprimento
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable("files");
  };
  