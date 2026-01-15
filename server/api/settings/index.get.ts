import {getUserSettings} from "~~/server/services/settings.service";

export default handleError(async (event) => {

    return await getUserSettings(event)
})

