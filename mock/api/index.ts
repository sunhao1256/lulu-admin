import auth from './auth';
import route from './route';
import management from './management';

export default [...management, ...auth, ...route];
