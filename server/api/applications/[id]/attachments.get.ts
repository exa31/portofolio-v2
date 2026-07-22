import {withAuth} from "~~/server/utils/withAuth";
import {getAttachments} from "~~/server/services/application.service";

export default withAuth(async (event) => {
    const {id} = event.context.params || {};
    return await getAttachments(event, id);
});
