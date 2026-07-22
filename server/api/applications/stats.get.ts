import {withAuth} from "~~/server/utils/withAuth";
import {getStats} from "~~/server/services/application.service";

export default withAuth(async (event) => {
    return await getStats(event);
});
