const knex = require("knex")(require("./knexfile").development);

async function getSchema() {
  try {
    // Get all table definitions
    const tables = await knex("sqlite_master")
      .where({ type: "table" })
      .select("name", "sql");

    console.log("Current Schema:");
    tables.forEach((table) => {
      console.log(`\nTable: ${table.name}`);
      console.log(table.sql);
    });

    // Get additional details for each table (columns)
    for (const table of tables) {
      const columns = await knex(table.name).columnInfo();
      console.log(`\nColumns for ${table.name}:`);
      console.table(columns);
    }
  } catch (error) {
    console.error("Error fetching schema:", error.message);
  } finally {
    knex.destroy();
  }
}

getSchema();
