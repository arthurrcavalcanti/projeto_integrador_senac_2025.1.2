const knex = require('knex')(require('./knexfile').development);

async function runMigrations() {
  try {
    console.log('🔄 Running database migrations...');
    const [batchNo, log] = await knex.migrate.latest();
    
    if (log.length === 0) {
      console.log('✅ Database is already up to date');
    } else {
      console.log(`✅ Batch ${batchNo} run: ${log.length} migrations`);
      log.forEach(migration => console.log(`   - ${migration}`));
    }
  } catch (error) {
    console.error('❌ Error running migrations:', error.message);
    process.exit(1);
  } finally {
    await knex.destroy();
  }
}

runMigrations();
