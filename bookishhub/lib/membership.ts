import { getAuthSession } from "./authentication";
import { databaseClient } from "./database";

const verifyMembership = async () => {
  const session = await getAuthSession();

  if (!session?.user) 
  {
    return false;
  }

  const membership = await databaseClient.membership.findUnique({
    where: {
      userId: session.user.id,
    }
  })

  if (membership === null) 
  {
    return false;
  }

  return !!(membership.paymentCurrentPeriodEnding?.getTime()! + miliseconds_in_a_day > Date.now() && membership.paymentAmmountId);
}

const miliseconds_in_a_day = 86400000;

export default verifyMembership;