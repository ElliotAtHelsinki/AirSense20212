import { useSelector, useDispatch } from 'react-redux'
import {
  changeStatus,
  updateUser,
  updateSetting,
  appSelects,
} from '../../store/appReducer'
import { isEmpty } from '../utils/opLodash'
import { clearToken, setToken } from '../models/Base'

export default function useUser() {
  const dispatch = useDispatch()
  const user = useSelector(appSelects.selectUser)
  const manifests = useSelector(appSelects.selectUserManifest)
  const permissions = useSelector(appSelects.selectUserPermissions)
  const clearUser = () => {
    dispatch(updateUser({}))
    localStorage.removeItem('user')
    clearToken()
  }

  const changeUser = (newUser) => {
    if (isEmpty(newUser)) {
      dispatch(updateUser({}))
      localStorage.removeItem('user')
    } else {
      dispatch(updateUser(newUser.data))
      localStorage.setItem('user', JSON.stringify(newUser.data))
      setToken(newUser.token)
    }
  }

  const changeStatus = (status) => {
    // dispatch(appActions.changeStatus(status));
  }

  return {
    user,
    manifests,
    permissions,
    changeUser,
    clearUser,
    changeStatus,
  }
}
