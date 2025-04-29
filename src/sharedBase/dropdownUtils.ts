import { DropdownChangeEvent } from "./globalImports";


export const selectDropdownEnum = (
    e: DropdownChangeEvent,
    controlName: string,
    setName = false,
    model: any
  ) => {
    const updatedModel = { ...model };
  
    updatedModel[controlName] = e.value;
    updatedModel[`${controlName}Label`] = e.target.name;
  
    if (setName) {
      updatedModel[controlName] = e.target.name;
    }
  
    return updatedModel;
  };
  