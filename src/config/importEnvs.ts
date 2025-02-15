import { config } from 'dotenv';
import path from 'path';

((): void => {
  config({ path: path.resolve(__dirname, '../../', '.env') });
})();
