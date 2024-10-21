import questionsTable from "../db";
import { calculateCycle, getRegionConfig } from "../utils/utils";

export const handler = async () => {
  const regions = await questionsTable.getItems("CONFIG#REGIONS");
  const now = new Date();

  const questions: any = [];

  for (const region of regions) {
    const config = await getRegionConfig(region);
    if (!config) {
      console.log(`No config found for region: ${region}`);
      continue;
    }

    const currentCycle = calculateCycle(
      config.cycleStart,
      config.cycleDuration,
      now
    );
    const questionId =
      config.questionSet[currentCycle % config.questionSet.length];

    questions.push({
      pk: `CYCLE#${region}#${currentCycle}`,
      sk: "QUESTION",
      region,
      cycle: currentCycle,
      questionId,
      timestamp: now.toISOString(),
    });
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Questions assigned successfully" }),
  };
};
