import questionsTable from "../db";
import { calculateCycle, getRegionConfig } from "../utils/utils";

export const handler = async (event: any) => {
  const region = event.queryStringParameters?.region;
  if (!region) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Missing region query parameter",
      }),
    };
  }

  const now = new Date();

  const config = await getRegionConfig(region);
  if (!config) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: `No configuration found for region: ${region}`,
      }),
    };
  }

  const currentCycle = calculateCycle(
    config.cycleStart,
    config.cycleDuration,
    now
  );

  const result = await questionsTable.getItemWithSk(
    `CYCLE#${region}#${currentCycle}`,
    "QUESTION"
  );

  if (!result) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: `No question assigned for region: ${region} and cycle: ${currentCycle}`,
      }),
    };
  }

  const questionId = result.questionId;

  return {
    statusCode: 200,
    body: JSON.stringify({ questionId }),
  };
};
