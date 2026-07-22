import {withAuth} from "~~/server/utils/withAuth";
import {uploadAttachment} from "~~/server/services/application.service";

export default withAuth(async (event) => {
    const {id} = event.context.params || {};
    return await uploadAttachment(event, id);
});
