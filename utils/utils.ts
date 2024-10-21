import questionsTable from "../db";

export const calculateCycle = (
  cycleStart: string,
  cycleDuration: number,
  now: Date
) => {
  const startTime = new Date(cycleStart).getTime();
  const elapsedTime = now.getTime() - startTime;
  return Math.floor(elapsedTime / (cycleDuration * 86400000)); // 86400000 = milliseconds in a day
};

export const getRegionConfig = async (region: string) => {
  const pk = `REGION#${region}`;
  const sk = "CONFIG";

  return questionsTable.getItemWithSk(pk, sk);
};
