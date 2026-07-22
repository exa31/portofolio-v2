import {withAuth} from "~~/server/utils/withAuth";
import {update} from "~~/server/services/application.service";

export default withAuth(async (event) => {
    const {id} = event.context.params || {};
    const body = await readBody(event);
    return await update(event, id, body);
});
