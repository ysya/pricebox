import { withResponse } from '~/server/utils/withResponse'
import { UserService } from '../../services'

export default withResponse(async (event) => {
  const userService = new UserService()
  const page = parseInt(getQuery(event).page as string) || 1
  const pageSize = parseInt(getQuery(event).pageSize as string) || 10
  const { data, pageInfo } = await userService.findAll(page, pageSize)

  return {
    data,
    pageInfo
  }
}) 