import { ClassType, Field, InputType } from "type-graphql";
import { getMetadataStorage as getTypeGraphQLMetadataStorage } from "type-graphql/dist/metadata/getMetadataStorage";
import { getMetadataStorage } from "../types";

const getInputResponseData = (type: any) => {
 const metadataStorage = getMetadataStorage();
 const inputDatas = metadataStorage.input.filter((f) => f.target === type);
 return inputDatas;
};

interface IGenraeteInputOption {
 name?: string;
 purpose?: "create" | "update";
}

export const generateInputDataType = <T>(
 type: ClassType<T>,
 { purpose = "create", name }: IGenraeteInputOption
) => {
 const inputData = getInputResponseData(type);
 const typeGraphQLMetadata = getTypeGraphQLMetadataStorage();
 const dataName = `${name || type.name}`;

 const inputClassContainer = {
  [dataName]: class {},
 };
 //원래 클래스를 반환해야함 따라서 type에있는
 InputType()(inputClassContainer[dataName]);
 for (const {
  field,
  getReturnType,
  descriptor,
  createOptions,
  updateOptions,
 } of inputData) {
  const tempOption = purpose === "create" ? createOptions : updateOptions;
  const graphQLField = typeGraphQLMetadata.fieldResolvers.find(
   (fr) => fr.target === type && fr.methodName === field
  );

  const originField = typeGraphQLMetadata.fields.find(
   (fr) => fr.target === type && fr.name === field
  );

  const fieldName = graphQLField ? graphQLField.schemaName : field;
  const baseReturnType =
   typeof getReturnType === "function"
    ? getReturnType()
    : originField
    ? originField.getType()
    : String;

  const baseReturn = () => baseReturnType;
  const target = inputClassContainer[dataName].prototype;

  const option = { ...originField?.typeOptions, ...tempOption };

  if (descriptor) {
   Field(baseReturn, option)(target, fieldName, descriptor);
  } else {
   Field(baseReturn, option)(target, fieldName);
  }
 }

 Object.setPrototypeOf(inputClassContainer[dataName].prototype, type.prototype);
 return inputClassContainer[dataName];
};
