import { FieldOptions } from "type-graphql";
import { getMetadataStorage, ReturnTypeFunc } from "../types";

interface IInputFieldOptions {
 create?: FieldOptions;
 update?: FieldOptions;
}

export function Input(
 returnTypeFunction?: ReturnTypeFunc | IInputFieldOptions,
 options?: IInputFieldOptions
) {
 return (
  prototype,
  field: string | symbol,
  descriptor?: PropertyDescriptor
 ) => {
  const type =
   typeof returnTypeFunction === "function" ? returnTypeFunction : undefined;
  const option =
   typeof returnTypeFunction === "function" ? options : returnTypeFunction;
  const metadataStorage = getMetadataStorage();
  metadataStorage.input.push({
   field,
   getReturnType: type,
   target: prototype.constructor,
   descriptor,
   createOptions: {
    nullable: true,
    ...option?.create,
   },
   updateOptions: {
    nullable: true,
    ...option?.update,
   },
  });
 };
}
