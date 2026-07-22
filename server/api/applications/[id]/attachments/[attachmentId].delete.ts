import {withAuth} from "~~/server/utils/withAuth";
import {deleteAttachment} from "~~/server/services/application.service";

export default withAuth(async (event) => {
    const {id, attachmentId} = event.context.params || {};
    return await deleteAttachment(event, id, attachmentId);
});
