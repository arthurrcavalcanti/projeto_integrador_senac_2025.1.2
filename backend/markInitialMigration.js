const knex = require('knex')(require('./knexfile').development);

async function markInitialMigration() {
  try {
    // Check if the initial migration is already recorded
    const existing = await knex('knex_migrations')
      .where({ name: '20250127000000_initial_schema.js' })
      .first();
    
    if (existing) {
      console.log('✅ Initial migration already recorded');
    } else {
      // Insert the initial migration record
      await knex('knex_migrations').insert({
        name: '20250127000000_initial_schema.js',
        batch: 1,
        migration_time: new Date()
      });
      console.log('✅ Initial migration marked as completed');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await knex.destroy();
  }
}

markInitialMigration();
