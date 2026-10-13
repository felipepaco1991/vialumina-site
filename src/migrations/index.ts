import * as migration_20261008_231648_inicial from './20261008_231648_inicial';
import * as migration_20261009_165422_cadastros from './20261009_165422_cadastros';
import * as migration_20261013_190000_r2_storage from './20261013_190000_r2_storage';

export const migrations = [
  {
    up: migration_20261008_231648_inicial.up,
    down: migration_20261008_231648_inicial.down,
    name: '20261008_231648_inicial',
  },
  {
    up: migration_20261009_165422_cadastros.up,
    down: migration_20261009_165422_cadastros.down,
    name: '20261009_165422_cadastros'
  },
  {
    up: migration_20261013_190000_r2_storage.up,
    down: migration_20261013_190000_r2_storage.down,
    name: '20261013_190000_r2_storage',
  },
];
