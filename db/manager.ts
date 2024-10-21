import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import {
  BatchGetCommand,
  BatchWriteCommand,
  DeleteCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

export interface DBOptions extends DynamoDBClientConfig {
  region: string;
}

export class DB {
  private TableName: string;
  private client: DynamoDBClient;

  constructor(options: DBOptions, TableName: string) {
    this.TableName = TableName;
    this.client = new DynamoDBClient(options);
  }

  private setTableName(params: any) {
    params.TableName = this.TableName;
  }

  put(params: any) {
    this.setTableName(params);

    return this.client.send(new PutCommand(params));
  }

  query(params: any) {
    this.setTableName(params);

    return this.client.send(new QueryCommand(params));
  }

  delete(params: any) {
    this.setTableName(params);

    return this.client.send(new DeleteCommand(params));
  }

  update(params: any) {
    this.setTableName(params);

    return this.client.send(new UpdateCommand(params));
  }

  async scan(params: any) {
    params.TableName = this.TableName;
    return this.client
      .send(new ScanCommand(params))
      .then((result) => result.Items);
  }

  saveItem(item: any) {
    const params = {
      Item: item,
    };

    return this.put(params);
  }

  getItem(
    pk: string,
    specificAttributes: string[] | null = null,
    filter: string | null = null,
    filterValues: { [key: string]: string } | null = null,
    limit: number | null = null
  ) {
    return this.getItems(
      pk,
      specificAttributes,
      filter,
      filterValues,
      limit
    ).then((response) => (!response[0] ? null : response[0]));
  }

  getItems(
    pk: string,
    specificAttributes: string[] | null = null,
    filter: string | null = null,
    filterValues: { [key: string]: string } | null = null,
    limit: number | null = null
  ) {
    const params: any = {
      KeyConditionExpression: "pk = :pk",
      ExpressionAttributeValues: {
        ":pk": pk,
      },
      ProjectionExpression: specificAttributes,
      TableName: this.TableName,
      Limit: limit,
    };

    if (filter) {
      params.FilterExpression = filter;
      params.ExpressionAttributeValues = {
        ...params.ExpressionAttributeValues,
        ...filterValues,
      };
    }

    return this.queryWithPagination(params);
  }

  getItemWithSk(
    pk: string,
    sk: string,
    specificAttributes: string[] | null = null,
    filter: string | null = null,
    filterValues: { [key: string]: string } | null = null
  ) {
    return this.getItemsWithSk(
      pk,
      sk,
      specificAttributes,
      filter,
      filterValues
    ).then((response) => (!response[0] ? null : response[0]));
  }

  getItemsWithSk(
    pk: string,
    sk: string,
    specificAttributes: string[] | null = null,
    filter: string | null = null,
    filterValues: { [key: string]: string } | null = null
  ) {
    const params: any = {
      KeyConditionExpression: "pk = :pk AND sk = :sk",
      ExpressionAttributeValues: {
        ":pk": pk,
        ":sk": sk,
      },
      ProjectionExpression: specificAttributes,
      TableName: this.TableName,
    };

    if (filter) {
      params.FilterExpression = filter;
      params.ExpressionAttributeValues = {
        ...params.ExpressionAttributeValues,
        ...filterValues,
      };
    }
    return this.queryWithPagination(params);
  }

  getItemBeginsWithSk(
    pk: string,
    sk: string,
    specificAttributes: string[] | null = null,
    filter: string | null = null,
    filterValues: { [key: string]: string } | null = null
  ) {
    return this.getItemsBeginsWithSk(
      pk,
      sk,
      specificAttributes,
      filter,
      filterValues
    ).then((response) => (!response[0] ? null : response[0]));
  }

  getItemsBeginsWithSk(
    pk: string,
    sk: string,
    specificAttributes: string[] | null = null,
    filter: string | null = null,
    filterValues: { [key: string]: string } | null = null
  ) {
    const params: any = {
      KeyConditionExpression: "pk = :pk AND begins_with (sk,:s)",
      ExpressionAttributeValues: {
        ":pk": pk,
        ":s": sk,
      },
      ProjectionExpression: specificAttributes,
      TableName: this.TableName,
    };

    if (filter) {
      params.FilterExpression = filter;
      params.ExpressionAttributeValues = {
        ...params.ExpressionAttributeValues,
        ...filterValues,
      };
    }
    return this.queryWithPagination(params);
  }

  async batchGetItems(keys: any[]) {
    const params = {
      RequestItems: {},
    };
    params.RequestItems[this.TableName] = { Keys: keys };

    return this.client
      .send(new BatchGetCommand(params))
      .then((result) => result.Responses?.[this.TableName]);
  }

  deleteItem(pk: string, sk: string) {
    const params = {
      Key: {
        pk: pk,
        sk: sk,
      },
      TableName: this.TableName,
    };

    return this.delete(params);
  }

  replaceItem(item: any) {
    const params = {
      Key: {
        pk: item.pk,
        sk: item.sk,
      },
      Item: item,
    };

    return this.put(params);
  }

  updateAttributes(pk: string, sk: string, attributesToBeUpdated: any) {
    let updateExpression = generateUpdateQuery(attributesToBeUpdated);
    const params = {
      Key: {
        pk: pk,
        sk: sk,
      },

      ...updateExpression,
    };

    return this.update(params);
  }

  updateAndRemoveAttributes(
    pk: string,
    sk: string,
    attributesToUpdate: any,
    attributesToRemove: any
  ) {
    let updateExpression = generateUpdateAndRemoveQuery(
      attributesToUpdate,
      attributesToRemove
    );
    const params = {
      Key: {
        pk: pk,
        sk: sk,
      },

      ...updateExpression,
    };

    return this.update(params);
  }

  async batchScanItems() {
    let scanResults: any[] = [];
    let count = 0;
    let items;
    let params: any = {};

    do {
      items = await this.scan(params);

      scanResults.push(...items.Items);
      count += items.Count;
      console.log(`Scanned ${count} items, successfully!`);

      params.ExclusiveStartKey = items.LastEvaluatedKey;
    } while (typeof items.LastEvaluatedKey !== "undefined");

    return { scanResults, count };
  }

  async batchWriteItems(items: any[]) {
    const requestParams = preparePutRequestParams(items);
    const chunks = await sliceInChunks(requestParams);
    const promises = chunks.map(async (chunk, index) => {
      const params = { RequestItems: { [this.TableName]: chunk } };
      let response = await this.client.send(new BatchWriteCommand(params));

      console.log(`Chunk ${index + 1} response: ${response}`);
    });

    return await Promise.all(promises);
  }

  async batchDelete(items: any[]) {
    const requestParams = prepareDeleteRequestParams(items);
    const chunks = await sliceInChunks(requestParams);
    const promises = chunks.map(async (chunk) => {
      const params = { RequestItems: { [this.TableName]: chunk } };
      let response = await this.client.send(new BatchWriteCommand(params));
      console.log(response);
    });

    return await Promise.all(promises);
  }

  async queryWithPagination(params) {
    return (await this.queryWithPaginationAndCursor(params)).items;
  }

  async queryWithPaginationAndCursor(params) {
    let scanResults: any[] = [];
    let count = 0;
    let items;

    do {
      items = await this.client.send(new QueryCommand(params));
      if (items.LastEvaluatedKey !== "undefined") {
        console.log(
          `Count: ${items.Count} ScannedCount: ${items.ScannedCount}`
        );
      }
      scanResults.push(...items.Items);
      count += items.Count;
      params.ExclusiveStartKey = items.LastEvaluatedKey;
    } while (
      typeof items.LastEvaluatedKey !== "undefined" &&
      (!params.Limit || scanResults.length < params.Limit)
    );

    scanResults =
      params.Limit && scanResults.length > params.Limit
        ? scanResults.slice(0, params.Limit)
        : scanResults;
    console.log(`Total items returned: ${count}`);

    return {
      items: scanResults,
      cursor: items.LastEvaluatedKey,
    };
  }
}

function prepareDeleteRequestParams(items) {
  const requestParams = items.map((item) => ({
    DeleteRequest: {
      Key: {
        pk: item.pk,
        sk: item.sk,
      },
    },
  }));

  return requestParams;
}

function preparePutRequestParams(items) {
  const requestParams = items.map((item) => ({
    PutRequest: {
      Item: item,
    },
  }));

  return requestParams;
}

async function sliceInChunks(items: { [key: string]: any }[]) {
  let i = 0;
  let j = 0;
  const CHUNK_SIZE = 25;
  const chunks: any[] = [];

  for (i = 0, j = items.length; i < j; i += CHUNK_SIZE) {
    chunks.push(items.slice(i, i + CHUNK_SIZE));
  }

  return chunks;
}

function generateUpdateQuery(fields) {
  let exp = {
    UpdateExpression: "set",
    ExpressionAttributeNames: {},
    ExpressionAttributeValues: {},
  };
  Object.entries(fields).forEach(([key, item]) => {
    exp.UpdateExpression += ` #${key} = :${key},`;
    exp.ExpressionAttributeNames[`#${key}`] = key;
    exp.ExpressionAttributeValues[`:${key}`] = item;
  });
  exp.UpdateExpression = exp.UpdateExpression.slice(0, -1);
  return exp;
}

function generateRemoveQuery(fields) {
  let exp = {
    UpdateExpression: "remove",
    ExpressionAttributeNames: {},
  };
  fields.forEach((key) => {
    exp.UpdateExpression += ` #${key},`;
    exp.ExpressionAttributeNames[`#${key}`] = key;
  });
  exp.UpdateExpression = exp.UpdateExpression.slice(0, -1);
  return exp;
}

function generateUpdateAndRemoveQuery(fieldsToUpdate, fieldsToRemove) {
  const removeExp = generateRemoveQuery(fieldsToRemove);
  let exp = generateUpdateQuery(fieldsToUpdate);

  exp.UpdateExpression += " " + removeExp.UpdateExpression;
  exp.ExpressionAttributeNames = {
    ...exp.ExpressionAttributeNames,
    ...removeExp.ExpressionAttributeNames,
  };

  return exp;
}
