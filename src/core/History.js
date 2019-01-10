import Config from './Config';

import { useRouterHistory } from 'react-router'
import { createHistory } from 'history'

const history = useRouterHistory(createHistory)({
  basename: Config.basename
})

export default history;