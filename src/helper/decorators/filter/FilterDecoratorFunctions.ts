import { assert } from "console";
import { DIVIDER } from "../types";

export const divideFieldName = (
 field: string
): { operator: string; field: string } => {
 // TODO: Filter Query Generator 생성
 if (field === "AND" || field === "OR") {
  return {
   field,
   operator: field,
  };
 }
 const splitted = field.split(DIVIDER);
 return {
  field: replaceFieldName(splitted[0]),
  operator: splitted[1],
 };
};

export const replaceFieldName = (fieldName: string) => {
 const result = fieldName.replace(/_/g, ".");
 if (result[0] === ".") {
  return `_${result.substr(1)}`;
 }
 return result;
};
export const getFirstName = (fieldName: string) => {
 const splited = fieldName.split("_");
 if (splited[0] === "_") {
  return `_${splited[1]}`;
 }
 return splited[0];
};

export const toMongoQuery = (data: Record<string, any>) => {
 let temp = {} as any;
 for (const key in data) {
  const value = data[key];
  const { field, operator } = divideFieldName(key);
  if (field === "AND" || field === "OR" || field === "elemMatch") {
   let key = "";
   if (field === "OR") key = "$or";
   if (field === "AND") key = "$and";
   if (field === "elemMatch") {
    const keys = Object.keys(value);
    const firstKey = keys[0];
    const primaryKey = getFirstName(firstKey);
    const entry = Object.entries(value);
    const nextObj: any = {};
    entry.forEach((val) => {
     val[0] = val[0].replace(primaryKey + "_", "");
     nextObj[val[0]] = val[1];
    });
    console.log({ nextObj });
    temp = {
     ...temp,
     [primaryKey]: {
      $elemMatch: toMongoQuery(nextObj),
     },
    };
   } else {
    temp = {
     ...temp,
     [key]: toMongoQueryAndOr(value),
    };
   }
  } else {
   temp[field] = {
    ...temp[field],
    ...genField(operator, value),
   };
  }
 }
 return temp;
};

export const toMongoQueryAndOr = (data: Record<string, any>[]) => {
 const result = [] as any[];
 data.forEach((d) => {
  const temp = {} as any;
  for (const key in d) {
   const value = d[key];
   const { field, operator } = divideFieldName(key);

   if (field === "AND" || field === "OR" || field === "elemMatch") {
    let key = "";
    if (field === "OR") key = "$or";
    if (field === "AND") key = "$and";
    if (field === "elemMatch") key = "$elemMatch";
    result.push({
     [key]: toMongoQueryAndOr(value),
    });
   } else {
    temp[field] = genField(operator, value);
   }
  }
  result.push(temp);
 });
 return result;
};

export const genField = (
 gqlOperator: string,
 value: any
): Record<string, any> => {
 switch (gqlOperator) {
  case "contains":
   return { $regex: new RegExp(`(${value as string})`, "gi") };
  case "not_contains":
   return { $not: new RegExp(`(${value as string})`, "gi") };
  case "all":
   return { $all: value instanceof Array ? value : [value] };
  case "not_all":
   return {
    $not: { $all: value instanceof Array ? value : [value] },
   };
  case "eq":
   return { $eq: value };
  case "not_eq":
   return { $ne: value };
  case "in":
   return { $in: value };
  case "not_in":
   return { $nin: value };
  case "gte":
  case "lte":
  case "lt":
  case "gt":
   return {
    [`$${gqlOperator}`]: value,
   };
  default:
   assert(gqlOperator, "Not supported operator");
   return {};
 }
};

export type FilterQuery = {
 [fieldNoperator: string]: string | string[] | FilterQuery;
};

export type FilterQueryOutput = {
 field: string;
 operator: string;
 value: string | string[] | FilterQueryOutput;
};
