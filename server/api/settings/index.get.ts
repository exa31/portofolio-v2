import {getUserSettings} from "~~/server/services/settings.service";
import {withAuth} from "~~/server/utils/withAuth";

export default withAuth(async (event) => {
    const userId = event.context.user.id! as string

    return await getUserSettings(event, userId)
})

