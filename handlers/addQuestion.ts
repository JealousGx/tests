import questionsTable from "../db";

export const handler = async (event: any) => {
  try {
    const body = JSON.parse(event.body);
    const { region, cycle, questionId } = body;

    if (!region || !cycle || !questionId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Missing required fields: region, cycle, questionId",
        }),
      };
    }

    const now = new Date();

    const item = {
      pk: `CYCLE#${region}#${cycle}`,
      sk: "QUESTION",
      region,
      cycle,
      questionId,
      timestamp: now.toISOString(),
    };

    await questionsTable.saveItem(item);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Question added successfully" }),
    };
  } catch (error) {
    console.error("Error adding question:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
