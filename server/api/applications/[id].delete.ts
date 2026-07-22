import {withAuth} from "~~/server/utils/withAuth";
import {remove} from "~~/server/services/application.service";

export default withAuth(async (event) => {
    const {id} = event.context.params || {};
    return await remove(event, id);
});
