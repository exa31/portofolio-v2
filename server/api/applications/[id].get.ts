import {withAuth} from "~~/server/utils/withAuth";
import {findById} from "~~/server/services/application.service";

export default withAuth(async (event) => {
    const {id} = event.context.params || {};
    return await findById(event, id);
});
