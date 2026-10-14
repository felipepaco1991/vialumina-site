import * as migration_20261008_231648_inicial from './20261008_231648_inicial';
import * as migration_20261009_165422_cadastros from './20261009_165422_cadastros';
import * as migration_20261013_190000_r2_storage from './20261013_190000_r2_storage';
import * as migration_20261014_164750_formadores from './20261014_164750_formadores';

export const migrations = [
  {
    up: migration_20261008_231648_inicial.up,
    down: migration_20261008_231648_inicial.down,
    name: '20261008_231648_inicial',
  },
  {
    up: migration_20261009_165422_cadastros.up,
    down: migration_20261009_165422_cadastros.down,
    name: '20261009_165422_cadastros',
  },
  {
    up: migration_20261013_190000_r2_storage.up,
    down: migration_20261013_190000_r2_storage.down,
    name: '20261013_190000_r2_storage',
  },
  {
    up: migration_20261014_164750_formadores.up,
    down: migration_20261014_164750_formadores.down,
    name: '20261014_164750_formadores'
  },
];
