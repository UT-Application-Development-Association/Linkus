import { useLocation} from 'react-router-dom';
const qs = require('query-string');

export function useQuery() {
    const { search } = useLocation();
    qs.parse(search);
}